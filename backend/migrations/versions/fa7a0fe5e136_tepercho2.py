"""TeperCho2

Revision ID: fa7a0fe5e136
Revises: 829658d29e7c
Create Date: 2024-08-16 14:57:39.436840

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fa7a0fe5e136'
down_revision: Union[str, None] = '829658d29e7c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('event', sa.Column('latitude', sa.Float(), nullable=True))
    op.add_column('event', sa.Column('longitude', sa.Float(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('event', 'longitude')
    op.drop_column('event', 'latitude')
    # ### end Alembic commands ###
