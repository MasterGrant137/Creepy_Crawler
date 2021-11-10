"""Settings routes."""

from flask import Blueprint, request
from app.models import db, Theme
from app.forms import ThemeForm
from flask_login import current_user, login_required
from app.s3_helpers import (upload_file_to_s3, allowed_file, get_unique_filename)

settings_routes = Blueprint('settings', __name__)

def validation_errors_to_error_messages(validation_errors):
    """Turn the WTForms validation errors into a simple list."""
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field}: {error}')
    return errorMessages

@settings_routes.route('/', methods=['POST'])
@login_required
def add_theme():
    """Add a theme to settings."""
    form = ThemeForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():   
        new_theme = Theme(
            user_id=request.form['user_id'],
            theme_name=request.form['theme_name'],
            background_color=request.form['background_color'],
            font_color=request.form['font_color'],
            font_family=request.form['font_family'],
            font_size=request.form['font_size'],
            accent_1=request.form['accent_1'],
            accent_2=request.form['accent_2'],
            accent_3=request.form['accent_3']
        )

        if request.form['background_rotate'] == 'false': new_theme.background_rotate=False
        else: new_theme.background_rotate=True

        if 'background_media' in request.files:
            background_media = request.files['background_media']
            if allowed_file(background_media.filename):
                background_media.filename = get_unique_filename(background_media.filename)
                upload = upload_file_to_s3(background_media)
                if 'url' in upload:
                    url = upload['url']
                    new_theme.background_media=url

        db.session.add(new_theme)
        db.session.commit()

        return { 'setting': new_theme.to_dict() }
    return {  }

@settings_routes.route('/')
@login_required
def get_themes():
    """Get all of the themes belonging to a given user."""
    themes = Theme.query.filter(Theme.user_id == current_user.id).all()
    return { 'settings': [ theme.to_dict() for theme in themes ] }

@settings_routes.route('/<int:settingID>', methods=['PUT'])
@login_required
def update_theme(settingID):
    """Update a theme."""
    theme = Theme.query.filter(Theme.id == settingID).first()

    if 'background_media' in request.files:
        background_media = request.files['background_media']
        if allowed_file(background_media.filename):
            background_media.filename = get_unique_filename(background_media.filename)
            upload = upload_file_to_s3(background_media)
            if 'url' in upload:
                url = upload['url']
                theme.background_media=url

    if request.form['background_rotate'] == 'false': theme.background_rotate=False
    else: theme.background_rotate=True

    if ((theme.user_id == current_user.id) and (theme.id == int(request.form['setting_id']))):
        theme.user_id=request.form['user_id']
        theme.theme_name=request.form['theme_name']
        theme.background_color=request.form['background_color']
        theme.font_color=request.form['font_color']
        theme.font_family=request.form['font_family']
        theme.font_size=request.form['font_size']
        theme.accent_1=request.form['accent_1']
        theme.accent_2=request.form['accent_2']
        theme.accent_3=request.form['accent_3']

        db.session.add(theme)
        db.session.commit()

        return { 'setting': theme.to_dict() }
    return { 'errors': ['You are not permitted to edit this theme!'] }, 401

@settings_routes.route('/<int:settingID>', methods=['DELETE'])
@login_required
def delete_theme(settingID):
    """Delete a theme."""
    theme = Theme.query.filter(Theme.id == settingID).first()

    if theme.user_id == current_user.id:
        db.session.delete(theme)
        db.session.commit()
        return { 'message': 'successful' }
    return { 'errors': ['You are not permitted to delete this theme!'] }, 401