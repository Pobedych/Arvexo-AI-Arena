"""Proactive background maintenance for tournaments (§13.4, §16.7).

Runs on a timer inside the API process so attempts are auto-submitted once their
deadline passes even if nobody happens to hit a tournament endpoint afterwards.
"""

import logging
import threading

from app.db.session import SessionLocal

logger = logging.getLogger(__name__)

INTERVAL_SECONDS = 30

_stop_event = threading.Event()
_thread: threading.Thread | None = None


def _run_once() -> None:
    from app.api.routes.tournaments import finalize_due_attempts, sync_open_tournaments

    db = SessionLocal()
    try:
        sync_open_tournaments(db)
        finalize_due_attempts(db)
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Tournament maintenance job failed")
    finally:
        db.close()


def _loop() -> None:
    while not _stop_event.wait(INTERVAL_SECONDS):
        _run_once()


def start() -> None:
    global _thread
    if _thread is not None:
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
