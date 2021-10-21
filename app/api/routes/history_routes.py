from flask import Blueprint
from flask_migrate import Migrate, history
from app.models import db

history_routes = Blueprint('entries', __name__)
