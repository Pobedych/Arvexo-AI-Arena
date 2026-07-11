"""add activity logs

Revision ID: fccc26766ccc
Revises: c75514285097
Create Date: 2026-07-10 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fccc26766ccc'
down_revision: Union[str, Sequence[str], None] = 'c75514285097'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('activity_logs',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('user_id', sa.Uuid(), nullable=False),
    sa.Column('activity_date', sa.Date(), nullable=False),
    sa.Column('action_count', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['arena_users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('user_id', 'activity_date', name='uq_user_activity_date')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('activity_logs')
