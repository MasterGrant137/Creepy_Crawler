from app.models import db, History
from faker import Faker
fake = Faker()
import random

timezones = ['Alpha Time Zone', 'Australian Western Standard Time', 'Eastern Standard Time', 'Pacific Standard Time', 'X-ray Time Zone']

def seed_users():
    demo = History(username='Demo', email='demo@aa.io', password='password')
    db.session.add(demo)

    for i in range(250):
        searchEntry = History(
            user_id=random.randint(1, 50),
            search=fake.sentence(nb_words=10),
            timezone=timezones[random.randint(0, 4)],
            updated_at=fake.date_time()
        )
        db.session.add(searchEntry)

    db.session.commit()

def undo_history():
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()


    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    search = db.Column(db.String(1000), nullable=True)
    visit = db.Column(db.String(1000), nullable=True)
    timezone=db.Column(db.String(50), nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)
