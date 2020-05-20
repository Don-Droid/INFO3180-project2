"""empty message

Revision ID: 36d31c92461a
Revises: 61cb65b2ac1a
Create Date: 2020-05-17 11:53:40.260025

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '36d31c92461a'
down_revision = '61cb65b2ac1a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('post_user_id_key', 'post', type_='unique')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint('post_user_id_key', 'post', ['user_id'])
    # ### end Alembic commands ###
