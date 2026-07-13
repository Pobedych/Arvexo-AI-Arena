"""add lesson steps

Revision ID: b1c4d9e6f210
Revises: 9a3e8b2d5c01
Create Date: 2026-07-13 12:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "b1c4d9e6f210"
down_revision: Union[str, Sequence[str], None] = "9a3e8b2d5c01"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "lesson_steps",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("lesson_id", sa.Uuid(), nullable=False),
        sa.Column("title", sa.String(length=220), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("order", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["lesson_id"], ["lessons.id"]),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("lesson_steps")
