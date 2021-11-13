"""User Model."""

from .db import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    """User model."""

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    clock_24 = db.Column(db.Boolean, nullable=False, default=True)
    active_theme = db.Column(db.SmallInteger, nullable=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_media = db.Column(db.String(1000), nullable=False, default='https://randomuser.me/api/portraits/lego/2.jpg')
    theme_count = db.Column(db.SmallInteger, nullable=False, default=0)
    username = db.Column(db.String(40), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now())

    @property
    def password(self):
        """Password definition."""
        return self.hashed_password

    @password.setter
    def password(self, password):
        """Hash and salt password.

        Hash a password with the given method and salt with a
        string of the given length. The format of the string
        returned includes a method for check_password_hash to
        check the hash.
        """
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        """Check password against a given salted and hashed password value."""
        return check_password_hash(self.password, password)

    def to_dict(self):
        """Make selected columns into dictionary upon invocation by routes."""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profile_media': self.profile_media,
            'active_theme': self.active_theme,
            'theme_count': self.theme_count
        }
