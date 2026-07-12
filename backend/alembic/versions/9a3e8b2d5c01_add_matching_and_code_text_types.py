"""add matching and code text question types

Revision ID: 9a3e8b2d5c01
Revises: 8f2d7a1c4b90
Create Date: 2026-07-12 19:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "9a3e8b2d5c01"
down_revision: Union[str, Sequence[str], None] = "8f2d7a1c4b90"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        op.execute("ALTER TYPE questiontype ADD VALUE IF NOT EXISTS 'matching'")
        op.execute("ALTER TYPE questiontype ADD VALUE IF NOT EXISTS 'code_text'")
    op.add_column("questions", sa.Column("configuration", sa.JSON(), nullable=True))


def downgrade() -> None:
    # PostgreSQL enum values cannot be removed safely while rows may use them.
    op.drop_column("questions", "configuration")
