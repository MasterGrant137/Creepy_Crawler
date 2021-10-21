"""History routes.

Components pass send form data to store.
Store passes data to backend routes which
use the forms to process data before
committing the data to the database.
"""

from datetime import datetime
from flask import Blueprint, request
from flask_migrate import Migrate, history
from app.models import db, History
from app.forms import SearchForm

history_routes = Blueprint('entries', __name__)

def validation_errors_to_error_messages(validation_errors):
    """Simple function that turns the WTForms validation errors into a simple list"""
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@history_routes.route('/', methods=['POST'])
def add_history_entry():
    """Add a search entry to history."""
    form = SearchForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        parsed_js_date = form.data['updated_at'].split('-')[0]
        history_entry = History(
            user_id=form.data['user_id'],
            search=form.data['search'],
            updated_at=datetime.strptime(parsed_js_date, '%a %b %d %Y %H:%M:%S %Z')
        )
        db.session.add(history_entry)
        db.session.commit()
        return {"message": "successful"}
    print({'errors': validation_errors_to_error_messages(form.errors)}), 401
