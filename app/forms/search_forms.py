"""Search forms creation.

Receives form data from backend routes.
Processes data (validation, organization, etc.).
Holds the relevant data for backend routes.
"""

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired

class SearchForm(FlaskForm):
    """Responsible for processing post requests for search queries."""

    search = StringField('search', validators=[DataRequired()])


class VisitForm(FlaskForm):
    """Responsible for processing posts requests for clicked links."""

    visit = StringField('visit', validators=[DataRequired()])
