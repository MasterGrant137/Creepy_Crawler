"""Settings routes."""

from flask import Blueprint, request
from flask_migrate import Migrate
from app.models import db, User, Theme, user
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
    """Add a theme to settings."""
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
    )

    db.session.add(new_theme)
    db.session.commit()

    return { 'setting': new_theme.to_dict() }

@settings_routes.route('/')
@login_required
def get_themes():
    """Get all of the themes belonging to a given user."""
    themes = Theme.query.filter(Theme.user_id == current_user.id).all()
    return { 'settings': [ theme.to_dict() for theme in themes ] }

@settings_routes.route('/<int:settingID>', methods=['PATCH'])
@login_required
def append_background_media(settingID):
    """Update theme data to include background media."""
    if 'media' not in request.files:
        return {'errors': 'media required'}, 400
  
    media = request.files['media']

    if not allowed_file(media.filename):
        return {'errors': ['That file type is not permitted.']}, 400

    media.filename = get_unique_filename(media.filename)
    upload = upload_file_to_s3(media)
   
    #? if dict has no filename key
    if 'url' not in upload:
        return upload, 400

    url = upload['url']

    theme = Theme.query.filter(Theme.id == settingID).first()
    theme.background_media=url

    db.session.add(theme)
    db.session.commit()

    # return { 'user': theme.to_dict() }
    return { 'setting': theme.to_dict() }


@settings_routes.route('/<int:settingID>', methods=['PUT'])
@login_required
def update_theme(settingID):
    """Update a theme."""
    theme = Theme.query.filter(Theme.id == settingID).first()
    setting = request.json['setting']

    if ((theme.user_id == current_user.id) and (theme.id == int(setting['setting_id']))):
        theme.user_id=setting['user_id']
        theme.theme_name=setting['theme_name']
        theme.background_color=setting['background_color']
        theme.background_rotate=setting['background_rotate']
        theme.font_color=setting['font_color']
        theme.font_family=setting['font_family']
        theme.font_size=setting['font_size']
        theme.accent_1=setting['accent_1']
        theme.accent_2=setting['accent_2']
        theme.accent_3=setting['accent_3']

        db.session.add(theme)
        db.session.commit()

        return {
            'setting': theme.to_dict()
        }
    return { 'errors': ['You are not permitted to edit this theme.'] }, 401

@settings_routes.route('/<int:settingID>', methods=['DELETE'])
@login_required
def delete_theme(settingID):
    """Delete a theme."""
    theme = Theme.query.filter(Theme.id == settingID).first()

    if theme.user_id == current_user.id:
        db.session.delete(theme)
        db.session.commit()
        return { 'message': 'successful' }

    return { 'errors': ['You are not permitted to edit this theme.'] }, 401