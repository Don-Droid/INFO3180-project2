import os
import datetime
import jwt
from app import app, db, login_manager
from app.models import Post, Users, Likes, Follows
from flask import render_template, request, session, flash, url_for, redirect, jsonify, json, make_response
from werkzeug.utils import secure_filename
from .forms import RegisterForm, LoginForm, PostForm
from werkzeug.security import check_password_hash
from flask_login import login_user, logout_user, current_user, login_required



@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')

def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages




@app.route('/api/users/register', methods = ['POST'])
def register():
    form = RegisterForm()
    if request.method == "POST" and form.validate_on_submit():
        uname = form.uname.data
        pword = form.pword.data
        fname = form.fname.data
        lname = form.lname.data
        email = form.email.data
        location = form.location.data
        bio = form.bio.data
        photo = form.photo.data
        date = datetime.datetime.now()
        date = date.strftime("%B %Y")

        file = secure_filename(photo.filename)
        photo.save(os.path.join(
            app.config['PROFILE_PHOTO'], file))

        path = url_for('static', filename= "images/profile_photos/"+file)

        user = Users(username=uname, password=pword, firstname=fname, lastname=lname, email=email, location=location, biography=bio, profile_photo=path, joined_on="Member since " + date)
        db.session.add(user)
        db.session.commit()

        register = [{"message": "Registered Successfully"}]
    
        return jsonify(register = register)
    return jsonify(form_errors(form))
    

@app.route('/api/auth/login', methods = ['POST'])
def login ():
    form = LoginForm()
    if request.method == "POST" and form.validate_on_submit():

        if form.uname.data:
            uname = form.uname.data
            pword = form.pword.data

            user = Users.query.filter_by(username=uname).first()
            if user is not None and check_password_hash(user.password, pword):
                login_user(user)
                token = jwt.encode({"user_Id" : user.id}, 'app.config[SECRET_KEY]', algorithm='HS256').decode('utf-8')

                login = [{"message": "Login Successfully"},
                         {"token" : token}]

                return jsonify(login=login)
            login = [{"message": "Login Failed"}]
            return jsonify(login=login)
    return jsonify(form_errors(form))
        


@app.route('/api/auth/logout', methods = ['GET'])
def logout ():
    return ''


@app.route('/api/users/<user_id>/posts', methods = ['GET', 'POST'])
def post (user_id):
    form = PostForm()
    if request.method == "POST" and form.validate_on_submit():
        photo = form.photo.data
        caption = form.caption.data
        date = datetime.datetime.now()
        date = date.strftime("%d %b %Y")

        file = secure_filename(photo.filename)
        photo.save(os.path.join(
            app.config['PHOTO_FOLDER'], file))

        path = url_for('static', filename= "images/photos/"+file)

        post = Post(user_id=int(user_id), photo=path, caption=caption, created_on=date)
        db.session.add(post)
        db.session.commit()
        
        return jsonify({"Post" : "yes"})

    if request.method == "GET":
        user = Users.query.filter_by(id=user_id).first()
        posts = Post.query.filter_by(user_id=user_id).count()
        follows = Follows.query.filter_by(user_id=user_id).count()
        d = {}
        d['uid'] = user.id
        d['pphoto'] = user.profile_photo
        d['fname'] = user.firstname
        d['lname'] = user.lastname
        d['location'] = user.location
        d['bio'] = user.biography
        d['date'] = user.joined_on
        d['posts'] = posts
        d['follows'] = follows

        return jsonify(d=d)
    return jsonify({"Post" : "Not Valid"})


@app.route('/api/users/<user_id>/follow', methods = ['POST'])
def follow (user_id):
    if request.method == "POST":
        auth = request.headers.get('Authorization', None)
        parts = auth.split()
        if parts[0].lower() == 'bearer':
            token = parts[1]
            followID = jwt.decode(token, 'app.config[SECRET_KEY]')

            follow = Follows(user_id=int(user_id),follower_id=int(followID['user_Id']))
            db.session.add(follow)
            db.session.commit()
            user = Users.query.filter_by(id=int(user_id)).first()
            posts = Post.query.filter_by(user_id=user_id).count()
            follows = Follows.query.filter_by(user_id=user_id).count()
            d = {}
            d['uid'] = user.id
            d['pphoto'] = user.profile_photo
            d['fname'] = user.firstname
            d['lname'] = user.lastname
            d['location'] = user.location
            d['bio'] = user.biography
            d['date'] = user.joined_on
            d['posts'] = posts
            d['follows'] = follows
            return jsonify(d=d)
    return jsonify({"Follow" : "failed"})


@app.route('/api/posts', methods = ['GET'])
def all_post ():
    posts = db.session.query(Post).all()
    
    
    list2 = []
    for post in posts:
        d = {}
        uid = post.user_id
        user = Users.query.filter_by(id=uid).first()
        d['uid'] = user.id
        d['pphoto'] = user.profile_photo
        d['user'] = user.username
        d['pid'] = post.id
        d['photo'] = post.photo
        d['caption'] = post.caption
        d['date'] = post.created_on
        likes = Likes.query.filter_by(post_id=post.id).count()
        d['likes']= likes
        list2.append(d)

    data = dict(list(enumerate(list2)))
     
    return jsonify(data=data)


@app.route('/api/posts/<post_id>/like', methods = ['POST'])
def like (post_id):
    if request.method == "POST":
        auth = request.headers.get('Authorization', None)
        parts = auth.split()
        if parts[0].lower() == 'bearer':
            token = parts[1]
            liker = jwt.decode(token, 'app.config[SECRET_KEY]')
            
            like = Likes(user_id=int(liker['user_Id']),post_id=int(post_id))
            db.session.add(like)
            db.session.commit()
            return all_post()
    return jsonify({"Follow" : "failed"})



    

# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return Users.query.get(int(id))


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to tell browser not to cache the rendered page.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")

