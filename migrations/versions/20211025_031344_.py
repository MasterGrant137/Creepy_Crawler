"""empty message

Revision ID: 6da9bd4c5277
Revises: fe7561b87c1a
Create Date: 2021-10-25 03:13:44.080916

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '6da9bd4c5277'
down_revision = 'fe7561b87c1a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('histories', sa.Column('tz', sa.String(length=50), nullable=False))
    op.drop_column('histories', 'timezone')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('histories', sa.Column('timezone', sa.VARCHAR(length=50), autoincrement=False, nullable=False))
    op.drop_column('histories', 'tz')
    # ### end Alembic commands ###
