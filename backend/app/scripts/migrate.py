"""Apply Alembic migrations, adopting existing pre-Alembic databases safely.

Databases created before Alembic was introduced (via Base.metadata.create_all())
already have all baseline tables but no `alembic_version` table. Running a normal
`upgrade head` against them would fail trying to CREATE TABLE on tables that
already exist. In that specific case we stamp the database at head instead of
replaying the baseline migration; any schema drift from the ad-hoc column
patches applied before this migration existed is already covered by the
baseline revision's column set.
"""

from alembic import command
from alembic.config import Config
from sqlalchemy import inspect

from app.db.session import engine


def main() -> None:
    cfg = Config("alembic.ini")
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())

    if "arena_users" in existing_tables and "alembic_version" not in existing_tables:
        print("Existing pre-Alembic database detected: stamping at head instead of replaying baseline.")
        command.stamp(cfg, "head")
        return

    command.upgrade(cfg, "head")


if __name__ == "__main__":
    main()
