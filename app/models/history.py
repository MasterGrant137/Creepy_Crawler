"""History model creation."""

from .db import db
from datetime import datetime, timezone, tzinfo

class History(db.Model):
    """History Model."""

    __tablename__='histories'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    search = db.Column(db.String(1000), nullable=True)
    visit = db.Column(db.String(1000), nullable=True)
    timezone=db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now())
    updated_at = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        """Select columns made into dictionary upon invocation by routes."""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'search': self.search,
            'visit': self.visit,
            'timezone': self.timezone,
            'updated_at': self.updated_at
        }
