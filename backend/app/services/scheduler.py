import logging
import threading

from sqlalchemy import text

from app.core.config import settings
from app.db.session import SessionLocal

logger = logging.getLogger(__name__)

_POSTGRES_LOCK_KEY = 1_947_250_731
_stop_event = threading.Event()
_thread: threading.Thread | None = None


def _try_lock(db) -> bool:
    if db.get_bind().dialect.name != "postgresql":
        return True
    return bool(db.execute(text("SELECT pg_try_advisory_lock(:key)"), {"key": _POSTGRES_LOCK_KEY}).scalar())


def _unlock(db) -> None:
    if db.get_bind().dialect.name == "postgresql":
        db.execute(text("SELECT pg_advisory_unlock(:key)"), {"key": _POSTGRES_LOCK_KEY})


def run_once() -> None:
    from app.api.routes.tournaments import finalize_due_attempts, sync_open_tournaments

    db = SessionLocal()
    locked = False
    try:
        locked = _try_lock(db)
        if not locked:
            return
        sync_open_tournaments(db)
        finalize_due_attempts(db)
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Tournament maintenance job failed")
    finally:
        if locked:
            try:
                _unlock(db)
            except Exception:
                logger.exception("Tournament maintenance lock release failed")
        db.close()


def _loop() -> None:
    interval = max(5, settings.tournament_scheduler_interval_seconds)
    while not _stop_event.wait(interval):
        run_once()


def start() -> None:
    global _thread
    if not settings.tournament_scheduler_enabled or _thread is not None:
        return
    _stop_event.clear()
    _thread = threading.Thread(target=_loop, name="tournament-maintenance", daemon=True)
    _thread.start()


def stop() -> None:
    global _thread
    _stop_event.set()
    if _thread is not None:
        _thread.join(timeout=5)
        _thread = None
