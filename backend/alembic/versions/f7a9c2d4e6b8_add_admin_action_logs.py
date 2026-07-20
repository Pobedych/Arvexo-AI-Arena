"""add admin action logs

Revision ID: f7a9c2d4e6b8
Revises: e6f8a1b2c3d4
Create Date: 2026-07-20 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f7a9c2d4e6b8"
down_revision: Union[str, Sequence[str], None] = "e6f8a1b2c3d4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "admin_action_logs",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("admin_id", sa.Uuid(), nullable=False),
        sa.Column("action", sa.String(length=60), nullable=False),
        sa.Column("target_type", sa.String(length=60), nullable=False),
        sa.Column("target_id", sa.String(length=80), nullable=True),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["admin_id"], ["arena_users.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_admin_action_logs_admin_id"), "admin_action_logs", ["admin_id"], unique=False)
    op.create_index(op.f("ix_admin_action_logs_created_at"), "admin_action_logs", ["created_at"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_admin_action_logs_created_at"), table_name="admin_action_logs")
    op.drop_index(op.f("ix_admin_action_logs_admin_id"), table_name="admin_action_logs")
    op.drop_table("admin_action_logs")
