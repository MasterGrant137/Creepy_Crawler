"""Users seeder.

TRUNCATE removes all the data from the table,
RESET IDENTITY resets the auto incrementing primary key,
CASCADE deletes any dependent entities.
"""

from app.models import db, User
from faker import Faker
import random
import string

fake = Faker()
password_characters = string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation

def seed_users():
    """Seed the users."""
    demo = User(username='Demo', email='demo@aa.io', password='password')
    johnny_appleseed = User(username='Johnny Appleseed', email='jseed@aa.io', password='password')

    for i in range(50):
        new_user = User (
            username=fake.date_time_this_year(),
            email=fake.safe_email(),
            password=''.join(random.choice(password_characters) for i in range(15)),
            media=f"https://randomuser.me/api/portraits/{'men' if i % 2 == 0 else 'women'}/{i}.jpg"
        )

        db.session.add(demo)
        db.session.add(johnny_appleseed)
        db.session.add(new_user)

    db.session.commit()

def undo_users():
    """Undo users seed."""
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
