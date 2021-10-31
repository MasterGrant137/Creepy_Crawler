"""empty message

Revision ID: 047e922bf3d7
Revises: eca12f24e564
Create Date: 2021-10-30 11:37:07.809928

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '047e922bf3d7'
down_revision = 'eca12f24e564'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('themes', 'background_rotate')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('themes', sa.Column('background_rotate', sa.VARCHAR(), autoincrement=False, nullable=False))
    # ### end Alembic commands ###