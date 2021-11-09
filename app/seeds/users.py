"""Users seeder.

TRUNCATE removes all the data from the table,
RESET IDENTITY resets the auto incrementing primary key,
CASCADE deletes any dependent entities.
"""

from app.models import db, User
from faker import Faker

fake = Faker()

def seed_users():
    """Seed the users."""
    johnny_appleseed = User(username='Johnny Appleseed', email='jseed@aa.io', password='password', profile_media='https://randomuser.me/api/portraits/lego/8.jpg')
    db.session.add(johnny_appleseed)
    
    demo = User(username='Demo', email='demo@aa.io', password='password', profile_media='https://randomuser.me/api/portraits/lego/2.jpg')
    db.session.add(demo)

    for i in range(5):
        new_user = User (
            username=fake.user_name(),
            email=fake.safe_email(),
            password='password',
            profile_media=f"https://randomuser.me/api/portraits/{'men' if i % 2 == 0 else 'women'}/{i}.jpg",
            updated_at=fake.date_time_this_year()
        )
        db.session.add(new_user)

    db.session.commit()

def undo_users():
    """Undo users seed."""
    db.session.execute('TRUNCATE users RESTART IDENTITY CASCADE;')
    db.session.commit()
