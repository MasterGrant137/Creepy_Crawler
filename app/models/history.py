"""History model creation."""

from .db import db
from datetime import datetime

class History(db.Model):
    """History model."""

    __tablename__='histories'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    search = db.Column(db.String(1000), nullable=True)
    visit = db.Column(db.String(1000), nullable=True)
    tz=db.Column(db.String(50), nullable=False)
    tz_abbrev=db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now())
    updated_at = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        """Make selected columns into dictionary upon invocation by routes."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'search': self.search,
            'visit': self.visit,
            'tz': self.tz,
            'tz_abbrev': self.tz_abbrev,
            'updated_at': self.updated_at
        }
