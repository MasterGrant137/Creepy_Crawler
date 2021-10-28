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
    demo = User(username='Demo', email='demo@aa.io', password='password', profile_media='https://randomuser.me/api/portraits/lego/2.jpg')
    johnny_appleseed = User(username='Johnny Appleseed', email='jseed@aa.io', password='password', profile_media='https://randomuser.me/api/portraits/lego/8.jpg')
    db.session.add(demo)
    db.session.add(johnny_appleseed)

    for i in range(3):
        new_user = User (
            username=fake.user_name(),
            email=fake.safe_email(),
            password=''.join(random.choice(password_characters) for i in range(15)),
            profile_media=f"https://randomuser.me/api/portraits/{'men' if i % 2 == 0 else 'women'}/{i}.jpg",
            updated_at=fake.date_time_this_year()
        )
        db.session.add(new_user)

    db.session.commit()

def undo_users():
    """Undo users seed."""
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
