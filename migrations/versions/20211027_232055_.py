"""empty message

Revision ID: 45415bbf4a7b
Revises: f02b2429461c
Create Date: 2021-10-27 23:20:55.760805

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '45415bbf4a7b'
down_revision = 'f02b2429461c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('themes', sa.Column('background_media', sa.String(length=1000), nullable=True))
    op.drop_column('themes', 'background_image')
    op.add_column('users', sa.Column('profile_media', sa.String(length=1000), nullable=False))
    op.drop_column('users', 'media')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('media', sa.VARCHAR(length=1000), autoincrement=False, nullable=False))
    op.drop_column('users', 'profile_media')
    op.add_column('themes', sa.Column('background_image', sa.VARCHAR(length=1000), autoincrement=False, nullable=True))
    op.drop_column('themes', 'background_media')
    # ### end Alembic commands ###
