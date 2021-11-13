"""empty message

Revision ID: 55e01247578b
Revises: 9c3e3afa7278
Create Date: 2021-11-12 23:15:10.577538

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '55e01247578b'
down_revision = '9c3e3afa7278'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'active_theme',
               existing_type=sa.SMALLINT(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'active_theme',
               existing_type=sa.SMALLINT(),
               nullable=False)
    # ### end Alembic commands ###
