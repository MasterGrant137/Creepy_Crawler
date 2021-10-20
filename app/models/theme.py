"""Theme model creation."""

from .db import db
from datetime import datetime

class Theme(db.Model):
    """Theme Model."""

    __tablename__='themes'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    active = db.Column(db.Boolean, nullable=False, default=False)
    background_color = db.Column(db.String(7))
    background_image = db.Column(db.String(1000))
    font_color = db.Column(db.String(7))
    font_family = db.Column(db.String(50))
    font_size = db.Column(db.SmallInteger)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now())
