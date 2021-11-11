"""Settings form creation."""

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import Length, ValidationError

# def name_length(form, field):
    # """Check name length."""
    # theme_name = field.data
    # if len(theme_name) > 50: raise ValidationError('Theme name must be 50 or less characters!')
    # if theme_name: raise ValidationError('This is hit')

class ThemeForm(FlaskForm):
    """Responsible for processing requests from settings."""

    text = StringField('text', [Length(max=10, message='Theme name must be 50 or less characters!')])