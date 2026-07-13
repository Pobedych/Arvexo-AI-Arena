"""add interactive question types

Revision ID: d4e7f1a2b305
Revises: b1c4d9e6f210
Create Date: 2026-07-13 16:00:00.000000
"""

from typing import Sequence, Union

from alembic import op


revision: str = "d4e7f1a2b305"
down_revision: Union[str, Sequence[str], None] = "b1c4d9e6f210"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    if bind.dialect.name == "postgresql":
        for value in (
            "group_sort",
            "fill_blanks",
            "table_select",
            "code_order",
            "code_output",
            "code_fix",
            "image_hotspot",
            "graph_point",
            "number_line",
            "slider_experiment",
        ):
            op.execute(f"ALTER TYPE questiontype ADD VALUE IF NOT EXISTS '{value}'")


def downgrade() -> None:
    # PostgreSQL enum values cannot be removed safely while rows may use them.
    pass
