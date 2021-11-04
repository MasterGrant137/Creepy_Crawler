"""User routes."""

from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db, User
from app.s3_helpers import (upload_file_to_s3, allowed_file, get_unique_filename)

user_routes = Blueprint('users', __name__)

@user_routes.route('/<int:userID>')
@login_required
def user(userID):
    """Get a particular user ID."""
    user = User.query.get(userID)
    return user.to_dict()

@user_routes.route('/<int:userID>', methods=['PUT'])
@login_required
def upload_media(userID):
    """Upload media to aws and update database."""
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

    user = User.query.filter(User.id == userID).first()

    user.profile_media=url

    db.session.add(user)
    db.session.commit()

    return user.to_dict()

@user_routes.route('/profile/<int:settingID>', methods=['PATCH'])
@login_required
def edit_user_profile(settingID):
    """Update user profile setting."""
    profile_setting = request.json
    req_column = request.json['column']
    user = User.query.filter(User.id == current_user.id).first()

    if req_column == 'theme_count':
        user.theme_count = profile_setting['theme_count']
        db.session.add(user)
        db.session.commit()
        return user.to_dict()
    elif req_column == 'active_theme':
        user.active_theme = int(profile_setting['id'])
        db.session.add(user)
        db.session.commit()
        return user.to_dict()
    elif req_column == 'clock_24':
        user.clock_24 = profile_setting['clock_24']
        db.session.add(user)
        db.session.commit()

# @user_routes.route('/profile/reset-theme', methods=['PATCH'])
# @login_required
# def reset_user_theme():
#     """Set active theme to default."""
#     user = User.query.filter(User.id == current_user.id).first()
#     user.active_theme = None
#     db.session.add(user)
#     db.session.commit()
#     return { 'user': user.to_dict() }