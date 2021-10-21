"""History routes.

Components pass send form data to store.
Store passes data to backend routes which
use the forms to process data before
committing the data to the database.
"""

from datetime import datetime
from flask import Blueprint
from flask_migrate import Migrate, history
from app.models import db, History
from app.forms import SearchForm

history_routes = Blueprint('entries', __name__)

@history_routes.route('/', methods=['POST'], strict_slashes=False)
def add_history_entry():
    """Add a search entry to history."""
    form = SearchForm()
    if form.validate_on_submit():
        print('here is the form:', form)
        parsed_js_date = form.data['updated_at'].split('-')[0]
        converted_js_date = datetime.strptime(parsed_js_date, '%a %b %d %Y %H:%M:%S %Z')

        history_entry = History(
            user_id=form.data['user_id'],
            search=form.data['search'],
            updated_at=converted_js_date
        )
        db.session.add(history_entry)
        db.session.commit()
        return {"message": "successful"}
    return { "message": "unsuccessful" }
