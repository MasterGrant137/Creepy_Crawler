"""Settings form creation."""

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import Length

class ThemeForm(FlaskForm):
    """Responsible for processing requests from settings."""

    theme_name = StringField('theme_name', [Length(max=50, message='Theme name must be 50 characters or less!')])