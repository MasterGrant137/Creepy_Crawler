"""History routes.

Components pass send form data to store.
Store passes data to backend routes which
use the forms to process data before
committing the data to the database.
"""

from flask import Blueprint
from flask_migrate import Migrate, history
from app.models import db

history_routes = Blueprint('entries', __name__)
