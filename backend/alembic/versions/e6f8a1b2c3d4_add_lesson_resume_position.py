"""add lesson resume position

Revision ID: e6f8a1b2c3d4
Revises: d4e7f1a2b305
Create Date: 2026-07-16 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "e6f8a1b2c3d4"
down_revision: Union[str, Sequence[str], None] = "d4e7f1a2b305"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "lesson_progress",
        sa.Column("current_block", sa.Integer(), server_default="0", nullable=False),
    )


def downgrade() -> None:
    op.drop_column("lesson_progress", "current_block")
