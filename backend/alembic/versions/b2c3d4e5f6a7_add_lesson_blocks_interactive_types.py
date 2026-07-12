"""add lesson blocks and interactive question types

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-07-11 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, Sequence[str], None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        # New enum values must be committed before use; cannot be added and used in the same transaction.
        op.execute("COMMIT")
        op.execute("ALTER TYPE questiontype ADD VALUE IF NOT EXISTS 'ordering'")
        op.execute("ALTER TYPE questiontype ADD VALUE IF NOT EXISTS 'graph_point'")

    op.add_column('questions', sa.Column('chart_data', sa.JSON(), nullable=True))

    op.create_table('lesson_blocks',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('lesson_id', sa.Uuid(), nullable=False),
    sa.Column('order', sa.Integer(), nullable=False),
    sa.Column('kind', sa.Enum('theory', 'question', name='lessonblockkind'), nullable=False),
    sa.Column('theory', sa.Text(), nullable=True),
    sa.Column('question_id', sa.Uuid(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['lesson_id'], ['lessons.id'], ),
    sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
    sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_lesson_blocks_lesson_id'), 'lesson_blocks', ['lesson_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_lesson_blocks_lesson_id'), table_name='lesson_blocks')
    op.drop_table('lesson_blocks')
    op.drop_column('questions', 'chart_data')
    # Postgres enum values ('ordering', 'graph_point') are intentionally not removed:
    # ALTER TYPE ... DROP VALUE is unsupported without recreating the type.
