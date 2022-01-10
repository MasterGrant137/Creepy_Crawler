"""History seeder."""

from app.models import db, History
from faker import Faker
fake = Faker()
import random

time_zones = ['Uniform Time Zone', 'Pacific Standard Time']
time_zone_abbrevs = ['U', 'PST']

def seed_history():
    """Seed history."""
    for i in range(500):
        searchEntry = History(
            user_id=random.randint(1, 5),
            search=fake.sentence(nb_words=10),
            tz=time_zones[0 if i % 2 == 0 else 1],
            tz_abbrev=time_zone_abbrevs[0 if i % 2 == 0 else 1],
            updated_at=fake.date_time()
        )
        db.session.add(searchEntry)

    db.session.commit()

def undo_history():
    """Undo history seed."""
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
