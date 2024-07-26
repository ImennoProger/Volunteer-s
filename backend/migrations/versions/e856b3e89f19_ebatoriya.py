"""ebatoriya

Revision ID: e856b3e89f19
Revises: 
Create Date: 2024-07-24 17:44:55.305468

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e856b3e89f19'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('category',
    sa.Column('category_id', sa.Integer(), nullable=False),
    sa.Column('category_name', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('category_id'),
    sa.UniqueConstraint('category_id'),
    sa.UniqueConstraint('category_name')
    )
    op.create_table('country',
    sa.Column('country_id', sa.Integer(), nullable=False),
    sa.Column('country_name', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('country_id'),
    sa.UniqueConstraint('country_id')
    )
    op.create_table('permission',
    sa.Column('permission_id', sa.Integer(), nullable=False),
    sa.Column('permission_name', sa.String(), nullable=True),
    sa.Column('permission_details', sa.JSON(), nullable=True),
    sa.PrimaryKeyConstraint('permission_id'),
    sa.UniqueConstraint('permission_id'),
    sa.UniqueConstraint('permission_name')
    )
    op.create_table('role',
    sa.Column('role_id', sa.Integer(), nullable=False),
    sa.Column('role_name', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('role_id'),
    sa.UniqueConstraint('role_id'),
    sa.UniqueConstraint('role_name')
    )
    op.create_table('city',
    sa.Column('city_id', sa.Integer(), nullable=False),
    sa.Column('city_name', sa.String(), nullable=True),
    sa.Column('country_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['country_id'], ['country.country_id'], ),
    sa.PrimaryKeyConstraint('city_id'),
    sa.UniqueConstraint('city_id')
    )
    op.create_table('rolepermission',
    sa.Column('rolepermissions_id', sa.Integer(), nullable=False),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.Column('permission_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['permission_id'], ['permission.permission_id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['role_id'], ['role.role_id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('rolepermissions_id'),
    sa.UniqueConstraint('rolepermissions_id')
    )
    op.create_table('user_metadata',
    sa.Column('user_metadata_id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('hashed_password', sa.String(), nullable=True),
    sa.Column('user_name', sa.String(), nullable=True),
    sa.Column('user_surname', sa.String(), nullable=True),
    sa.Column('user_patronymic', sa.String(), nullable=True),
    sa.Column('age', sa.String(), nullable=True),
    sa.Column('country_id', sa.Integer(), nullable=True),
    sa.Column('city_id', sa.Integer(), nullable=True),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['city_id'], ['city.city_id'], onupdate='CASCADE', ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['country_id'], ['country.country_id'], onupdate='CASCADE', ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('user_metadata_id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('email', name='uq_user_metadata_email'),
    sa.UniqueConstraint('hashed_password', name='uq_user_metadata_hashed_password')
    )
    op.create_index(op.f('ix_user_metadata_user_metadata_id'), 'user_metadata', ['user_metadata_id'], unique=True)
    op.create_table('volunteer_org',
    sa.Column('vol_id', sa.Integer(), nullable=False),
    sa.Column('vol_name', sa.String(), nullable=True),
    sa.Column('vol_description', sa.String(), nullable=True),
    sa.Column('country_id', sa.Integer(), nullable=True),
    sa.Column('city_id', sa.Integer(), nullable=True),
    sa.Column('vol_foundation_date', sa.Date(), nullable=True),
    sa.Column('vol_contact_person', sa.Integer(), nullable=True),
    sa.Column('vol_phone', sa.Integer(), nullable=True),
    sa.Column('vol_email', sa.String(), nullable=True),
    sa.Column('vol_status', sa.Boolean(), nullable=True),
    sa.Column('vol_count_members', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['city_id'], ['city.city_id'], onupdate='CASCADE', ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['country_id'], ['country.country_id'], onupdate='CASCADE', ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('vol_id'),
    sa.UniqueConstraint('vol_id')
    )
    op.create_table('user',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('hashed_password', sa.String(), nullable=True),
    sa.Column('createdat', sa.TIMESTAMP(), nullable=True),
    sa.Column('user_metadata_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_metadata_id'], ['user_metadata.user_metadata_id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('user_id'),
    sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_user_user_id'), 'user', ['user_id'], unique=True)
    op.create_table('event',
    sa.Column('event_id', sa.Integer(), nullable=False),
    sa.Column('event_name', sa.String(), nullable=True),
    sa.Column('short_description', sa.String(), nullable=True),
    sa.Column('full_description', sa.String(), nullable=True),
    sa.Column('start_date', sa.Date(), nullable=True),
    sa.Column('end_date', sa.Date(), nullable=True),
    sa.Column('country_id', sa.Integer(), nullable=True),
    sa.Column('city_id', sa.Integer(), nullable=True),
    sa.Column('category_id', sa.Integer(), nullable=True),
    sa.Column('required_volunteers', sa.Integer(), nullable=True),
    sa.Column('registered_volunteers', sa.Integer(), nullable=True),
    sa.Column('participation_points', sa.Integer(), nullable=True),
    sa.Column('rewards', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('creation_date', sa.Date(), nullable=True),
    sa.Column('event_status', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['category_id'], ['category.category_id'], onupdate='CASCADE', ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['city_id'], ['city.city_id'], onupdate='CASCADE', ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['country_id'], ['country.country_id'], onupdate='CASCADE', ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('event_id'),
    sa.UniqueConstraint('event_id')
    )
    op.create_table('user_permission',
    sa.Column('user_permission_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('permission_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['permission_id'], ['permission.permission_id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('user_permission_id'),
    sa.UniqueConstraint('user_permission_id')
    )
    op.create_table('user_role',
    sa.Column('user_role_id', sa.Integer(), nullable=False),
    sa.Column('role_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['role_id'], ['role.role_id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('user_role_id'),
    sa.UniqueConstraint('user_role_id')
    )
    op.create_table('user_volunteer_org',
    sa.Column('user_volunteer_org_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('vol_id', sa.Integer(), nullable=True),
    sa.Column('join_date', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['vol_id'], ['volunteer_org.vol_id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('user_volunteer_org_id'),
    sa.UniqueConstraint('user_volunteer_org_id')
    )
    op.create_table('event_registration',
    sa.Column('registration_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('event_id', sa.Integer(), nullable=True),
    sa.Column('registration_date', sa.Date(), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['event.event_id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['user.user_id'], onupdate='CASCADE', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('registration_id'),
    sa.UniqueConstraint('registration_id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('event_registration')
    op.drop_table('user_volunteer_org')
    op.drop_table('user_role')
    op.drop_table('user_permission')
    op.drop_table('event')
    op.drop_index(op.f('ix_user_user_id'), table_name='user')
    op.drop_table('user')
    op.drop_table('volunteer_org')
    op.drop_index(op.f('ix_user_metadata_user_metadata_id'), table_name='user_metadata')
    op.drop_table('user_metadata')
    op.drop_table('rolepermission')
    op.drop_table('city')
    op.drop_table('role')
    op.drop_table('permission')
    op.drop_table('country')
    op.drop_table('category')
    # ### end Alembic commands ###