from flask import Blueprint
from flask_migrate import Migrate
from app.models import db

search_routes = Blueprint('searches', __name__)
