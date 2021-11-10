"""Signup form creation."""

from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, ValidationError
from app.models import User
import re

def user_exists(form, field):
    """Check if user exists."""
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user: raise ValidationError('Email address already in use.')

def username_exists(form, field):
    """Check if username is already in use."""
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user: raise ValidationError('Username already in use.')

def proper_password(form, field):
    """Check to see if password meets character and length requirements.

    Runs the user input against regex to see if it has an
    uppercase letter, lowercase letter, symbol, and number.
    It also determines if the length (8 characters) is 
    sufficient.
    """
    required_chars_regex = re.compile(r'''
    ([a-z])| #? lowercase letter
    ([A-Z])| #? uppercase letter
    ([0-9])| #? number
    ([\W_]) #? symbol
    ''', re.VERBOSE)


class SignUpForm(FlaskForm):
    """Signup form class."""

    username = StringField('username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired()])
