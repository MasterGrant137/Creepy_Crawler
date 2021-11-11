"""Login form creation."""

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, ValidationError
from app.models import User

def user_exists(form, field):
    """Check if user exists."""
    email = field.data
    user = User.query.filter(User.email == email).first()
    if not user: raise ValidationError('Email not found.')

def password_matches(form, field):
    """Check if password matches."""
    password = field.data
    email = form.data['email']
    user = User.query.filter(User.email == email).first()
    if not user: raise ValidationError('No such user exists.')
    if not user.check_password(password): raise ValidationError('Incorrect password.')

class LoginForm(FlaskForm):
    """Login form class."""

    email = StringField('email', validators=[DataRequired(message='Email is required!'), user_exists])
    password = PasswordField('password', validators=[DataRequired(message='Password is required!'), password_matches])
