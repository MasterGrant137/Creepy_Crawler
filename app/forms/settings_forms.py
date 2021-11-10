"""Settings form creation."""

from flask_wtf import FlaskForm
from wtforms import StringField, FileField
from wtforms.validators import ValidationError
from app.s3_helpers import (upload_file_to_s3, allowed_file, get_unique_filename)


def name_length(form, field):
    """Check name length."""
    theme_name = field.data
    if theme_name > 50:
        raise ValidationError('Theme name must be 50 or less characters!')

def file_type(form, field):
    """Check file type."""
    file = field.data
    print(file)

class ThemeForm(FlaskForm):
    """Responsible for processing requests from settings."""

    text = StringField('text', name_length)
    file = FileField('file', file_type)