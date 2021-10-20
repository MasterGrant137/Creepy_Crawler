from flask import Blueprint
from flask_migrate import Migrate
from app.models import db

settings_routes = Blueprint('settings', __name__)
