from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect

PROFILE_PHOTO = './app/static/images/profile_photos'
PHOTO_FOLDER = './app/static/images/photos'

app = Flask(__name__)
csrf = CSRFProtect(app)

app.config['SECRET_KEY'] = 'v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda'
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://xzqnhwozrazaaj:9319423d1fcd37c59e5807c08a8aee98b329fdb6de9d9097e29cd2c7442fb245@ec2-34-195-169-25.compute-1.amazonaws.com:5432/dd83hprsl4qi8l"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning

db = SQLAlchemy(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'explore'


app.config.from_object(__name__)
from app import views
