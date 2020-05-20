from . import db
from werkzeug.security import generate_password_hash

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80))
    photo = db.Column(db.String(150))
    caption = db.Column(db.String(500))
    created_on = db.Column(db.String(50))

    def __init__(self, user_id, photo, caption, created_on):
        self.user_id = user_id
        self.photo = photo
        self.caption = caption
        self.created_on = created_on

    def __repr__(self):
        return '<Post %r>' % self.user_id

class Users (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(275))
    firstname = db.Column(db.String(100))
    lastname = db.Column(db.String(100))
    email = db.Column(db.String(250))
    location = db.Column(db.String(150))
    biography = db.Column(db.String(1000))
    profile_photo = db.Column(db.String(150))
    joined_on = db.Column(db.String(80))

    def __init__(self, username, password, firstname, lastname, email, location, profile_photo, biography, joined_on):
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.location = location
        self.biography = biography
        self.profile_photo = profile_photo
        self.joined_on = joined_on
        
    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<Users %r>' % self.username

class Likes (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), unique=True)
    post_id = db.Column(db.String(80), unique=True)
    
    def __init__(self, user_id, post_id):
        self.user_id = user_id
        self.post_id = post_id

    def __repr__(self):
        return '<Likes %r>' % self.user_id

class Follows (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80))
    follower_id = db.Column(db.String(80), unique=True)
    
    def __init__(self, user_id, follower_id):
        self.user_id = user_id
        self.follower_id = follower_id

    def __repr__(self):
        return '<Follows %r>' % self.user_id
    
    
