from app.models import db, History
from faker import Faker
fake = Faker()
import random

# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', email='demo@aa.io', password='password')

    db.session.commit()


for i in range(500):
    newEntry = History(
        user_id=random.randint(1, 10)
        search
        visit
        timezone
        updated_at
    )


def undo_users():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()


    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    search = db.Column(db.String(1000), nullable=True)
    visit = db.Column(db.String(1000), nullable=True)
    timezone=db.Column(db.String(50), nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)
