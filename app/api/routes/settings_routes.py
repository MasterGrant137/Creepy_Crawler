"""Settings routes."""

from flask import Blueprint, request
from flask_migrate import Migrate
from app.models import db, User, Theme
from flask_login import current_user, login_required
from app.s3_helpers import (upload_file_to_s3, allowed_file, get_unique_filename)

settings_routes = Blueprint('settings', __name__)

def validation_errors_to_error_messages(validation_errors):
    """Turn the WTForms validation errors into a simple list."""
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@settings_routes.route('/', methods=['POST'])
def add_theme():
    """Add a theme."""
    theme_data = request.json
    print(theme_data)

    # theme = Theme(theme_data)

    # db.session.add(theme)
    # db.session.commit()

# * Add the line below after each conditional
# * return {'errors': validation_errors_to_error_messages(form.errors)}, 400
