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
    """Turn the WTForms validation errors into a simple list."""
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
        ([A-Z]{1}[a-z]{2}\s[A-Z]{1}[a-z]{2}\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2})\s #? date and time
        ([A-Z]{1,5}[-|+]\d{4})\s #? gmt offset
        \((.*)\) #? time zone
        ''', re.VERBOSE)
        abbrevTZRegex = r'([A-Z]){1}[-]?[a-z]+'
        natoTZRegex = r'[A-Z]TZ'

        js_date_parsed = re.search(js_date_regex, js_date).group(1)
        js_tz_parsed = re.search(js_date_regex, js_date).group(3)
        js_tz_abbrev = ''.join(re.findall(abbrevTZRegex, js_tz_parsed))


        history_entry = History(
            user_id=form.data['user_id'],
            search=form.data['search'],
            tz=js_tz_parsed,
            tz_abbrev=js_tz_abbrev if not re.search(natoTZRegex, js_tz_abbrev) else js_tz_abbrev[0],
            updated_at=datetime.strptime(js_date_parsed, '%a %b %d %Y %H:%M:%S')
        )

        db.session.add(history_entry)
        db.session.commit()
        return {
            'history': history_entry.to_dict()
        }
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@history_routes.route('/')
@login_required
def get_history_entries():
    """Get all of the history entries."""
    entries = History.query.filter(History.user_id == current_user.id).order_by(History.updated_at.desc()).all()
    return {
        'history': [ entry.to_dict() for entry in entries ]
    }

@history_routes.route('/<int:entryID>', methods=['PATCH'])
@login_required
def alter_history_entry(entryID):
    """Change the history entry's updated_at column."""
    entry = History.query.filter(History.id == entryID).first()

    if entry.user_id == current_user.id:
        js_date = request.json['updated_at']
        js_date_regex = re.compile(r'''
        ([A-Z]{1}[a-z]{2}\s[A-Z]{1}[a-z]{2}\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2})\s #? date and time
        ([A-Z]{1,5}[-|+]\d{4})\s #? gmt offset
        \((.*)\) #? tz
        ''', re.VERBOSE)
        abbrevTZRegex = r'([A-Z]){1}[-]?[a-z]+'
        natoTZRegex = r'[A-Z]TZ'

        js_date_parsed = re.search(js_date_regex, js_date).group(1)
        js_tz_parsed = re.search(js_date_regex, js_date).group(3)
        js_tz_abbrev = ''.join(re.findall(abbrevTZRegex, js_tz_parsed))

        print(js_tz_abbrev)
        new_updated_at = datetime.strptime(js_date_parsed, '%a %b %d %Y %H:%M:%S')
        entry.updated_at = new_updated_at
        entry.tz = js_tz_parsed
        entry.tz_abbrev = js_tz_abbrev if not re.search(natoTZRegex, js_tz_abbrev) else js_tz_abbrev[0]


        db.session.add(entry)
        db.session.commit()
        return {
            'history': entry.to_dict()
        }
    return {'errors': ['You are not permitted to edit this entry.']}, 401

@history_routes.route('/<int:entryID>', methods=['DELETE'])
@login_required
def delete_history_entry(entryID):
    entry = History.query.filter(History.id == entryID).first()

    if entry.user_id == current_user.id:
        db.session.delete(entry)
        db.session.commit()
        return { 'message': 'successful' }

    return { 'errors': ['You are not permitted to edit this entry.'] }, 401