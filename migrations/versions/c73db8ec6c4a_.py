"""empty message

Revision ID: c73db8ec6c4a
Revises: a6d9d14f7c6a
Create Date: 2020-05-27 22:22:37.254013

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c73db8ec6c4a'
down_revision = 'a6d9d14f7c6a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('follows_follower_id_key', 'follows', type_='unique')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint('follows_follower_id_key', 'follows', ['follower_id'])
    # ### end Alembic commands ###
