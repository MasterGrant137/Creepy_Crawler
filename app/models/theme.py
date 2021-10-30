"""Theme model creation."""

from .db import db
from datetime import datetime

class Theme(db.Model):
    """Theme model."""

    __tablename__='themes'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
    theme_name = db.Column(db.String(50), nullable=False, default='Theme')
    background_color = db.Column(db.String(7), nullable=False, default='#eae7dc')
    background_media = db.Column(db.String(1000), nullable=True)
    background_rotate = db.Column(db.String, nullable=False, default='False')
    font_color = db.Column(db.String(7), nullable=False, default='#e85a4f')
    font_family = db.Column(db.String(50), nullable=False, default='Georgia, serif')
    font_size = db.Column(db.String(4), nullable=False, default='16px')
    accent_1 = db.Column(db.String(7), nullable=False, default='#d8c3a5')
    accent_2 = db.Column(db.String(7), nullable=False, default='#8e8d8a')
    accent_3 = db.Column(db.String(7), nullable=False, default='#e98074')
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now())
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now())

    def to_dict(self):
            """Make selected columns into dictionary upon invocation by routes."""
            return {
                'id': self.id,
                'user_id': self.user_id,
                'theme_name': self.theme_name,
                'background_color': self.background_color,
                'background_rotate': self.background_rotate,
                'font_color': self.font_color,
                'font_family': self.font_family,
                'font_size': self.font_size,
                'accent_1': self.accent_1,
                'accent_2': self.accent_2,
                'accent_3': self.accent_3,
            }