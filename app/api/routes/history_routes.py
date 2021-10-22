"""History routes.

Components pass send form data to store.
Store passes data to backend routes which
use the forms to process data before
committing the data to the database.
"""

import re
from datetime import datetime
from flask import Blueprint, request
from flask_migrate import Migrate, history
from app.models import db, History
from app.forms import SearchForm
from flask_login import current_user, login_required

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
        js_date = form.data['updated_at']
        js_date_regex = re.compile(r'''
        ([A-Z]{1}[a-z]{2}\s[A-Z]{1}[a-z]{2}\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2})\s #? date
        ([A-Z]{1,5}[-|+]\d{4})\s #? gmt offset
        \((.*)\) #? timezone
        ''', re.VERBOSE)

        js_date_parsed = re.search(js_date_regex, js_date).group(1)
        js_timezone_parsed = re.search(js_date_regex, js_date).group(3)

        history_entry = History(
            user_id=form.data['user_id'],
            search=form.data['search'],
            timezone=js_timezone_parsed,
            updated_at=datetime.strptime(js_date_parsed, '%a %b %d %Y %H:%M:%S')
        )

        db.session.add(history_entry)
        db.session.commit()
        return {
            "history": history_entry.to_dict()
        }
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@history_routes.route('/')
@login_required
def get_history_entries():
    """Get all of the history entries."""
    entries = History.query.filter(History.user_id == current_user.id).all()
    print('LISTEN UP', [ entry.to_dict()['updated_at'] for entry in entries ])
    return {
        "history": [ entry.to_dict() for entry in entries ]
    }
