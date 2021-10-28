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
@login_required
def add_theme():
    """Add a theme."""
    # print('before the media')
    # if 'media' not in request.files:
    #     return {'errors': 'media required'}, 400
    # print('after the media')
    # media = request.files['media']

    # if not allowed_file(media.filename):
    #     return {'errors': ['That file type is not permitted.']}, 400

    # media.filename = get_unique_filename(media.filename)
    # upload = upload_file_to_s3(media)
   
    # #? if dict has no filename key
    # if 'url' not in upload:
    #     return upload, 400

    # url = upload['url']
    print('this is request.json', request.json)
    new_theme = Theme(
        user_id=request.json['user_id'],
        theme_name=request.json['theme_name'],
        background_color=request.json['background_color'],
        background_rotate=request.json['background_rotate'],
        font_color=request.json['font_color'],
        font_family=request.json['font_family'],
        font_size=request.json['font_size'],
        accent_1=request.json['accent_1'],
        accent_2=request.json['accent_2'],
        accent_3=request.json['accent_3'],
        # background_media=url
    )

    db.session.add(new_theme)
    db.session.commit()
    return {
        'setting': new_theme.to_dict()
    }

@settings_routes.route('/')
@login_required
def get_themes():
    """Get all of the themes belonging to a given user."""
    themes = Theme.query.filter(Theme.user_id == current_user.id).all()
    return {
        'settings': [ theme.to_dict() for theme in themes ]
    }


# * Add the line below after each conditional
# * return {'errors': validation_errors_to_error_messages(form.errors)}, 400
