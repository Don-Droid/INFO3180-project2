from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, PasswordField, TextAreaField
from wtforms.validators import DataRequired, Email


class RegisterForm(FlaskForm):
    uname = StringField('Username')
    pword = PasswordField('Password')
    fname = StringField('Firstname') 
    lname = StringField('Lastname')
    email = StringField('Email')
    location = StringField('Location')
    bio = TextAreaField('Biography')
    photo = FileField('Profile Photo')
    
    
class LoginForm(FlaskForm):
    uname = StringField('Username')
    pword = PasswordField('Password')


class PostForm(FlaskForm):
    photo = FileField('Photo')
    caption = TextAreaField ('Caption')
    
