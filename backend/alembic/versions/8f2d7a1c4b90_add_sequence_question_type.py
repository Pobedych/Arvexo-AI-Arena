"""add sequence question type

Revision ID: 8f2d7a1c4b90
Revises: fccc26766ccc
Create Date: 2026-07-12 18:00:00.000000
"""

from typing import Sequence, Union

from alembic import op


revision: str = "8f2d7a1c4b90"
down_revision: Union[str, Sequence[str], None] = "fccc26766ccc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute("ALTER TYPE questiontype ADD VALUE IF NOT EXISTS 'sequence'")
    # SQLite stores SQLAlchemy enums as text in this schema, so the new value
    # does not require a table or constraint change.


def downgrade() -> None:
    # PostgreSQL enum values cannot be removed safely while rows may use them.
    pass
