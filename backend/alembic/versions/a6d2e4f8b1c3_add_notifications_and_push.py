"""add notifications and push subscriptions

Revision ID: a6d2e4f8b1c3
Revises: f7a9c2d4e6b8
Create Date: 2026-07-23 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import context, op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision: str = "a6d2e4f8b1c3"
down_revision: Union[str, Sequence[str], None] = "f7a9c2d4e6b8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    offline = context.is_offline_mode()
    existing_tables = set() if offline else set(sa.inspect(bind).get_table_names())

    if bind.dialect.name == "postgresql":
        notification_kind = postgresql.ENUM(
            "tournament",
            "lesson",
            "streak_reminder",
            name="notificationkind",
            create_type=False,
        )
        notification_kind.create(bind, checkfirst=not offline)
    else:
        notification_kind = sa.Enum("tournament", "lesson", "streak_reminder", name="notificationkind")

    # The first production rollout raced Base.metadata.create_all() against
    # Alembic and may have created these objects without advancing the
    # revision. Treat matching existing tables as adopted migration state.
    if "notifications" not in existing_tables:
        op.create_table(
            "notifications",
            sa.Column("id", sa.Uuid(), nullable=False),
            sa.Column("user_id", sa.Uuid(), nullable=False),
            sa.Column("kind", notification_kind, nullable=False),
            sa.Column("title", sa.String(length=180), nullable=False),
            sa.Column("body", sa.Text(), nullable=False),
            sa.Column("href", sa.String(length=500), nullable=False),
            sa.Column("dedupe_key", sa.String(length=255), nullable=False),
            sa.Column("read_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("push_sent_at", sa.DateTime(timezone=True), nullable=True),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
            sa.ForeignKeyConstraint(["user_id"], ["arena_users.id"]),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("user_id", "dedupe_key", name="uq_user_notification_dedupe"),
        )
        op.create_index(op.f("ix_notifications_user_id"), "notifications", ["user_id"], unique=False)

    if "push_subscriptions" not in existing_tables:
        op.create_table(
            "push_subscriptions",
            sa.Column("id", sa.Uuid(), nullable=False),
            sa.Column("user_id", sa.Uuid(), nullable=False),
            sa.Column("endpoint_hash", sa.String(length=64), nullable=False),
            sa.Column("endpoint", sa.Text(), nullable=False),
            sa.Column("p256dh", sa.String(length=500), nullable=False),
            sa.Column("auth", sa.String(length=500), nullable=False),
            sa.Column("enabled", sa.Boolean(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
            sa.ForeignKeyConstraint(["user_id"], ["arena_users.id"]),
            sa.PrimaryKeyConstraint("id"),
        )
        op.create_index(
            op.f("ix_push_subscriptions_endpoint_hash"),
            "push_subscriptions",
            ["endpoint_hash"],
            unique=True,
        )
        op.create_index(op.f("ix_push_subscriptions_user_id"), "push_subscriptions", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_push_subscriptions_user_id"), table_name="push_subscriptions")
    op.drop_index(op.f("ix_push_subscriptions_endpoint_hash"), table_name="push_subscriptions")
    op.drop_table("push_subscriptions")
    op.drop_index(op.f("ix_notifications_user_id"), table_name="notifications")
    op.drop_table("notifications")
    if op.get_bind().dialect.name == "postgresql":
        sa.Enum(name="notificationkind").drop(op.get_bind(), checkfirst=True)
