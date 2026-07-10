from sqlalchemy import Engine, text
from sqlalchemy.exc import OperationalError, ProgrammingError

# Lightweight, additive-only schema patches for columns added after the initial
# create_all() bootstrap. There is no Alembic in this project; these statements
# are safe to run on every startup (idempotent) so existing production
# databases pick up new nullable/defaulted columns without manual SQL.
POSTGRES_STATEMENTS = [
    "ALTER TABLE arena_users ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE arena_users ADD COLUMN IF NOT EXISTS current_streak INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE arena_users ADD COLUMN IF NOT EXISTS longest_streak INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE arena_users ADD COLUMN IF NOT EXISTS last_active_date DATE",
]

SQLITE_STATEMENTS = [
    "ALTER TABLE arena_users ADD COLUMN xp INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE arena_users ADD COLUMN current_streak INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE arena_users ADD COLUMN longest_streak INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE arena_users ADD COLUMN last_active_date DATE",
]


def run_light_migrations(engine: Engine) -> None:
    if engine.dialect.name == "postgresql":
        with engine.begin() as conn:
            for statement in POSTGRES_STATEMENTS:
                conn.execute(text(statement))
        return

    # SQLite has no "ADD COLUMN IF NOT EXISTS"; ignore duplicate-column errors instead.
    for statement in SQLITE_STATEMENTS:
        try:
            with engine.begin() as conn:
                conn.execute(text(statement))
        except (OperationalError, ProgrammingError):
            pass
