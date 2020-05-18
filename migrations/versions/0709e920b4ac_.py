"""empty message

Revision ID: 0709e920b4ac
Revises: c771cecca68c
Create Date: 2020-05-21 09:05:15.321745

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0709e920b4ac'
down_revision = 'c771cecca68c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('likes',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('post_id', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('likes')
    # ### end Alembic commands ###