from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models import db, User
from app.s3_helpers import (upload_file_to_s3, allowed_file, get_unique_filename)

user_routes = Blueprint('users', __name__)

@user_routes.route('/<int:userID>', methods=['PATCH'])
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
    return {
        'user': user.to_dict()
    }

@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:userID>')
@login_required
def user(userID):
    """Get a particular user ID."""
    user = User.query.get(userID)
    return user.to_dict()
