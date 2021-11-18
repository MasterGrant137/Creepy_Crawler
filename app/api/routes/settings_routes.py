"""Settings routes."""

from flask import Blueprint, request
from app.models import db, Theme
from app.forms import ThemeForm
from flask_login import current_user, login_required
from flask.helpers import make_response
from app.s3_helpers import (upload_file_to_s3, allowed_file, get_unique_filename)

settings_routes = Blueprint('settings', __name__)

def validation_errors_to_error_messages(validation_errors):
    """Turn the WTForms validation errors into a simple list."""
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(error)
    return errorMessages

@settings_routes.route('/', methods=['POST'])
@login_required
def add_theme():
    """Add a theme to settings."""
    form = ThemeForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if current_user.theme_count >= 10:
        return {'errors': ['You are not permitted to add any more themes!']}, 400

    if form.validate_on_submit():
        new_theme = Theme(
            user_id=request.form['userID'],
            theme_name=request.form['themeName'],
            background_color=request.form['backgroundColor'],
            font_color=request.form['fontColor'],
            font_family=request.form['fontFamily'],
            font_size=request.form['fontSize'],
            accent_1=request.form['accent1'],
            accent_2=request.form['accent2'],
            accent_3=request.form['accent3']
        )

        if request.form['backgroundRotate'] == 'false': new_theme.background_rotate=False
        else: new_theme.background_rotate=True

        if 'backgroundMedia' in request.files:
            background_media = request.files['backgroundMedia']
            if allowed_file(background_media.filename):
                background_media.filename = get_unique_filename(background_media.filename)
                upload = upload_file_to_s3(background_media)
                if 'url' in upload:
                    url = upload['url']
                    new_theme.background_media=url

        db.session.add(new_theme)
        db.session.commit()
        return { 'setting': new_theme.to_dict() }
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@settings_routes.route('/')
@login_required
def get_themes():
    """Get all of the themes belonging to a given user."""
    themes = Theme.query.filter(Theme.user_id == current_user.id).all()
    response = make_response({ 'settings': [ theme.to_dict() for theme in themes ] })
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response

@settings_routes.route('/<int:settingID>', methods=['PUT'])
@login_required
def update_theme(settingID):
    """Update a theme."""
    form = ThemeForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        theme = Theme.query.filter(Theme.id == settingID).first()
        if ((theme.user_id == current_user.id) and (theme.id == int(request.form['settingID']))):
            theme.user_id=request.form['userID']
            theme.theme_name=request.form['themeName']
            theme.background_color=request.form['backgroundColor']
            theme.font_color=request.form['fontColor']
            theme.font_family=request.form['fontFamily']
            theme.font_size=request.form['fontSize']
            theme.accent_1=request.form['accent1']
            theme.accent_2=request.form['accent2']
            theme.accent_3=request.form['accent3']
        else: return { 'errors': ['You are not permitted to edit this theme!'] }, 401

        if request.form['backgroundRotate'] == 'false': theme.background_rotate=False
        else: theme.background_rotate=True

        if 'backgroundMedia' in request.files:
            background_media = request.files['backgroundMedia']
            if allowed_file(background_media.filename):
                background_media.filename = get_unique_filename(background_media.filename)
                upload = upload_file_to_s3(background_media)
                if 'url' in upload:
                    url = upload['url']
                    theme.background_media=url
                    
        db.session.add(theme)
        db.session.commit()
        return { 'setting': theme.to_dict() }
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@settings_routes.route('/<int:settingID>', methods=['DELETE'])
@login_required
def delete_theme(settingID):
    """Delete a theme."""
    theme = Theme.query.filter(Theme.id == settingID).first()

    if current_user.theme_count <= 0:
        return {'errors': ['You are not permitted to delete any more themes!']}, 400

    if theme.user_id == current_user.id:
        db.session.delete(theme)
        db.session.commit()
        return { 'message': 'successful' }
    return { 'errors': ['You are not permitted to delete this theme!'] }, 401