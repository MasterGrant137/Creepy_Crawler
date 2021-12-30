"""User routes."""

from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models import db, User
from app.s3_helpers import (upload_file_to_s3, allowed_file, get_unique_filename)

user_routes = Blueprint('users', __name__)

@user_routes.route('/<int:userID>', methods=['PUT'])
@login_required
def upload_media(userID):
    """Upload media to aws and update database."""
    if 'profileMedia' not in request.files:
        return {'errors': ['File is required!']}, 400

    profile_media = request.files['profileMedia']
    if not allowed_file(profile_media.filename):
        return {'errors': ['File type is not permitted!']}, 400
        
    profile_media.filename = get_unique_filename(profile_media.filename)
    upload = upload_file_to_s3(profile_media)
    if 'url' not in upload:
        return {'errors': ['No filename key, server error.']}, 500

    url = upload['url']
    user = User.query.filter(User.id == userID).first()
    user.profile_media=url

    db.session.add(user)
    db.session.commit()
    return user.to_dict()

@user_routes.route('/profile', methods=['PATCH'])
@login_required
def edit_user_profile():
    """Update user profile setting."""
    setting = request.json
    req_column = request.json['column']
    user = User.query.filter(User.id == current_user.id).first()

    if req_column == 'theme_count':
        if setting['operation']  == 'increment':
            if user.theme_count < 10: 
                user.theme_count += 1
        elif setting['operation']  == 'decrement':
            if user.theme_count > 0:
                user.theme_count -= 1
        db.session.add(user)
        db.session.commit()
        return user.to_dict()
    elif req_column == 'default_theme':
        user.default_theme = setting['default_theme']
        user.custom_theme = None
        db.session.add(user)
        db.session.commit()
        return user.to_dict()
    elif req_column == 'custom_theme':
        user.custom_theme = int(setting['id'])
        user.default_theme = None
        db.session.add(user)
        db.session.commit()
        return user.to_dict()
    elif req_column == 'clock_24':
        user.clock_24 = setting['clock_24']
        db.session.add(user)
        db.session.commit()
        return user.to_dict()