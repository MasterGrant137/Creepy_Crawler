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
    validation_errors = []

    password = field.data

    lowercase_letter_present = bool(re.search(r'[a-z]', password))
    uppercase_letter_present = bool(re.search(r'[A-Z]', password))
    number_present = bool(re.search(r'[0-9]', password))
    symbol_present = bool(re.search(r'[\W_]', password))

    if len(password) < 8 or len(password) > 255:
        raise ValidationError('Passwords must be between 8 and 255 characters, inclusively!')
    if not lowercase_letter_present: 
        validation_errors.append('Lowercase letter needed in password.')
    if not uppercase_letter_present: 
        validation_errors.append('Uppercase letter needed in password.')
    if not number_present: 
        validation_errors.append('Number needed in password.')
    if not symbol_present: 
        validation_errors.append('Symbol needed in password.')

    if len(validation_errors):
        raise ValidationError(' '.join(validation_errors))


class SignUpForm(FlaskForm):
    """Signup form class."""

    username = StringField('username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists])
    password = StringField('password', validators=[DataRequired(), proper_password])
