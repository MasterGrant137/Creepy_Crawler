"""Search form creation.

Receives form data from backend routes.
Processes data (validation, organization, etc.).
Holds the relevant data for backend routes.
"""

from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError

from app.api.routes.user_routes import user


class SearchForm(FlaskForm):
    """Responsible for processing search queries."""

    user_id = IntegerField('user_id', validators=[DataRequired()])
    search = StringField('search', validators=[DataRequired()])
    updated_at = StringField('updated_at', validators=[DataRequired()])


class VisitForm(FlaskForm):
    """Responsible for processing link clicks."""

    user_id = IntegerField('user_id', validators=[DataRequired()])
    visit = StringField('visit', validators=[DataRequired()])
    user_id = StringField('updated_at', validators=[DataRequired()])
