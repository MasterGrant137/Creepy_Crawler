"""Settings form creation."""

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired

class ThemeForm(FlaskForm):
    """Responsible for processing requests from settings."""

    text = StringField('text', validators=[DataRequired()])