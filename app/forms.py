from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, PasswordField, TextAreaField
from wtforms.validators import DataRequired, Email


class RegisterForm(FlaskForm):
    uname = StringField('Username', validators=[DataRequired()])
    pword = PasswordField('Password', validators=[DataRequired()])
    fname = StringField('Firstname', validators=[DataRequired()]) 
    lname = StringField('Lastname', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email])
    location = StringField('Location', validators=[DataRequired()])
    bio = TextAreaField('Biography', validators=[DataRequired()])
    photo = FileField('Profile Photo', validators=[DataRequired()])
    
    
class LoginForm(FlaskForm):
    uname = StringField('Username', validators=[DataRequired()])
    pword = PasswordField('Password', validators=[DataRequired()])


class PostForm(FlaskForm):
    photo = FileField('Photo', validators=[DataRequired()])
    caption = TextAreaField ('Caption', validators=[DataRequired()])
    
