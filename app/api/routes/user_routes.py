from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import User

user_routes = Blueprint('users', __name__)

@user_routes.route('/')
@login_required
def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:userID>')
@login_required
def user(userID):
    user = User.query.get(userID)
    return user.to_dict()
