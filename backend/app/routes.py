#--------------------------------------------------------Imports--------------------------------------------------------------------------------------
from flask import request,jsonify,render_template
from app.models import Comments, Favorite_post, Likes, Users, Blog_Info,Followers, ValidationTokens,client,NewsLetter,ndb
from app import app,bcrypt
from PIL import Image
import jwt
import os
import secrets
import uuid
from app.validEmail import check
from datetime import datetime
from app.tasks import create_task
from app.mail import validation_mail
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token,set_access_cookies,unset_access_cookies
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from google.cloud.ndb._datastore_query import Cursor
from app.essential_functions import pushapi,newslettermail,check_validation,create_validation
# from app.auth import register,login_with_cokies,logout_with_cookies,valid_id,validate_email

#-----------------------------------------------------------------Routes-----------------------------------------------------------------------------------

@app.route('/', defaults={'path': ''})                                                  # For all SPA routing
@app.route('/<path:path>')
def catch_all():
    return render_template("index.html")

@app.route('/api/setdp',methods=['PUT'])                                                # Allows the change of profile picture (work in progress)
@jwt_required()
def setdp():
    file = request.files.get('avatar')
    current_user = get_jwt_identity()
    with client.context():
        user = Users.query(Users.username==current_user).get()
        filename = secure_filename(file.filename)
        extension = filename.split('.')[1]
        new_filename = secrets.token_hex(16)
        #logging.info(new_filename)
        output_size = (150,150)
        resized_image = Image.open(file)
        resized_image.thumbnail(output_size)
        #logging.info("saving")
        resized_image.save(os.path.join('app/static/profile_pic/', new_filename + '.' + extension))
        #logging.info("saved")
        user.profile_picture = f'static/profile_pic/{new_filename}.{extension}'
        user.put()
        message = {
            "message":"uploaded successfully!",
            "dp":user.profile_picture  
        }
    return jsonify(message)

@app.route('/api/aboutme',methods=['PUT'])
@jwt_required()
def aboutme():
    data = dict(request.get_json())
    current_user = get_jwt_identity()
    with client.context():
        user = Users.query(Users.username == current_user).get()
        user.about_me = data.get('about_me')
        user.put()
        return jsonify({"message":"success"})

@app.route("/api/getuser", methods=["GET"])                                              # To check if the user is logged in or not
@app.route("/getuser", methods=["GET"])
@jwt_required()
def protected():
    current_user = get_jwt_identity()   
    message = {
        "user": current_user,
    }

    return jsonify(message), 200

@app.route('/api/getauthor',methods=['POST'])                                            # To get a user's details
def get_author():
    data = dict(request.get_json())
    print(data)
    with client.context():
        user = Users.query(Users.username==data.get('username')).get()
        following = len(Followers.query(Followers.follower == data.get('username')).fetch())
        followers = len(Followers.query(Followers.following == data.get('username')).fetch())
        message = {
                    "profile":user.profile_picture,
                    "email":user.email,
                    "about_me":user.about_me,
                    "no_of_followers":followers,
                    "no_of_following":following
                  }
        if Followers.query(Followers.follower==data['follower'],Followers.following==data['username']).get() is not None:
            message["following"] = True
        else:
            message["following"] = False

        return jsonify(message)

@app.route('/api/registeration',methods=['POST'])                                        # To register a new user. Checks for unique username and email address and basic email validation.                                         
def register():
    data = dict(request.get_json())
    errors={}
    if len(data['username']) < 3:
        errors['username'] = "Username must have atleast 4 characters"
    if not check(data['email']):
        errors['email'] = "invalid email address"
    if len(data['password']) < 3:
        errors['password'] = "Password must have atleast 4 characters"
        
    with client.context():    
        if Users.query(Users.username==data['username']).get() is not None:
            errors['username'] ="Username already exits!"         
        if Users.query(Users.email==data['email']).get() is not None:
            errors['email'] = "Email already registered!"    
        if errors:
            return jsonify({"errors":errors})

        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        payload = {
            "username":data.get('username'),
            "email":data.get('email'),
            "password":hashed_password,
            }
        id = uuid.uuid4().hex
        v_token = ValidationTokens(uuid=id, token=create_validation(payload))
        v_token.put()
        
        validation_mail(auth_link=f'http://localhost:3000/auth/{id}', email=data.get('email'))
       
        #logging.info(data)
        
        return jsonify({'message':"We have sent an activation link on your email. Click on that link to register yourself"})

@app.route('/api/auth/validate',methods=['POST'])
def validate_email():
    id = dict(request.get_json()).get('id')
    with client.context():
        token_data = ValidationTokens.query(ValidationTokens.uuid==id).get()
        if token_data is not None:
            try:
                data = check_validation(payload=token_data.token)
                user_data = data.get('payload')
                print(user_data)

                user = Users(uuid=uuid.uuid4().hex,
                                    username=user_data.get('username'), 
                                    email=user_data.get('email'),
                                    password=user_data.get('password'),
                                    date=datetime.utcnow()
                                    )
                            
                user.put()
                token_data.key.delete()
                return jsonify({'message':'success'})
            except jwt.ExpiredSignatureError:
                return jsonify({'message':"Expired"})
        return jsonify({"message":"Failed"})
        
@app.route('/api/validid',methods=['POST'])                                                # check for the special route(temp. solution)
def valid_id():
    data = dict(request.get_json()).get('id')
    with client.context():
        if ValidationTokens.query(ValidationTokens.uuid==data).get() is not None:
            return jsonify({"message":"valid"})
    return jsonify({"message":"not valid"})

@app.route('/api/login_with_cookies',methods=['POST'])                                      # Login with cookies
def login_with_cokies():
    data = request.get_json()
    with client.context():
        user = Users.query(Users.email==data['email']).get()
        if user and bcrypt.check_password_hash(user.password,data['password']):
            access_token = create_access_token(identity=user.username)
            message = {
                        "user":user.username
                      }
            response = jsonify(message)
            set_access_cookies(response,access_token)
            return response
            
        
    #logging.info(data.get('email'),data.get('password'))
    
    return jsonify({'error':"Check your email or password again"}),401

@app.route("/api/logout", methods=["POST"])
def logout_with_cookies():
    response = jsonify({"msg": "logout successful"})
    unset_access_cookies(response)
    return response

@app.route('/api/get',methods=['POST'])                                                    # To get all the post by all users
@app.route('/get')
def get():
    data = dict(request.get_json())
    # create_task(payload={"hello":"hi"}, in_seconds=1)
    if data.get('hasmore'):
        curse = None
        if data.get('page'):
            curse = Cursor(urlsafe=data.get('page'))

        offset = 3
        if not data.get('strip'):
            offset = 0
        print(curse)

        with client.context():
            blog_info_list, cursor, hasmore =  Blog_Info.query().order(-Blog_Info.date).fetch_page(5,start_cursor=curse,offset=offset)
            
            result_dict = {
                "result": [],
                "page": None
            }
            
            if blog_info_list:
                for data in blog_info_list:
                    blog = data.to_dict()
                    user = Users.query(Users.username==blog.get('username')).get()
                    blog["picture"] = user.profile_picture       
                    blog["id"] = data.key.id()
                    blog['likes'] = Likes.query(Likes.liked_post==blog.get('id')).count()
                    blog['comments'] = Comments.query(Comments.post ==blog.get('id')).count()
                    result_dict['result'].append(blog)
                    
                result_dict['page'] = cursor.urlsafe().decode("utf-8")
            result_dict['hasmore'] = hasmore

            
            return result_dict
    return []

@app.route('/api/latest')                                                                 # To get the three latest post (ordered by date)
def latest():
    with client.context():
        result = [data for data in Blog_Info.query().order(-Blog_Info.date).fetch(3)]
        
        dict = []
        for data in result:
            blog = data.to_dict()
            user = Users.query(Users.username==blog.get('username')).get()
            blog["picture"] = user.profile_picture       
            blog["id"] = data.key.id()
            dict.append(blog)
        return dict

@app.route('/get/<int:id>',methods={'POST'})                                              # To get a post by it's id attribute
def get_by_id(id):
    data = dict(request.get_json())
    with client.context():

        result = Blog_Info.get_by_id(id)
        result_with_id = result.to_dict()
        visitor = data.get("follower")
        

        if Followers.query(Followers.follower==visitor,Followers.following==result_with_id.get('username')).get() is not None:
            result_with_id["following"] = True
        else:
            result_with_id['following'] = False

        if visitor is not None:
            user_mail = Users.query(Users.username==visitor).get().email
            subscribers_mail = Users.query(Users.username==result_with_id.get('username')).get().email
            if NewsLetter.query(NewsLetter.subscriber==user_mail,NewsLetter.subscribed_to==subscribers_mail).get() is not None:
                result_with_id['subscribed'] = True
        else:
            result_with_id['subscribed'] = False

        if Favorite_post.query(Favorite_post.user==visitor,Favorite_post.post==id).get() is not None:
            result_with_id['favorite'] = True
        else:
            result_with_id['favorite'] = False
        if Likes.query(Likes.liked_by==visitor,Likes.liked_post==id).get() is not None:
            result_with_id['liked'] = True
        else:
            result_with_id['liked'] = False

        profile = Users.query(Users.username==result_with_id.get('username')).get()
        result_with_id["picture"] = profile.profile_picture
        result_with_id["id"] = id
        return jsonify(result_with_id)

@app.route("/api/myposts",methods=["POST"])                                               # To get all post of a particular user 
def user_post():
    data = dict(request.get_json())
    if data.get('hasmore'):
        curse = None
        if data.get('page'):
            curse = Cursor(urlsafe=data.get('page'))
        with client.context():
            blogs, cursor, hasmore = Blog_Info.query(Blog_Info.username == data.get("username")).order(-Blog_Info.date).fetch_page(5,start_cursor=curse)
            all_blogs_dict = {
                "all_blogs":[],
                "page":None
            }
            if blogs:
                for blog in blogs:
                    data_to_append = blog.to_dict()
                    user = Users.query(Users.username==data_to_append.get('username')).get()
                    data_to_append["id"] = blog.key.id()
                    data_to_append["picture"] = user.profile_picture
                    data_to_append['likes'] = Likes.query(Likes.liked_post==data_to_append.get('id')).count()
                    data_to_append['comments'] = Comments.query(Comments.post ==data_to_append.get('id')).count() 
                    all_blogs_dict["all_blogs"].append(data_to_append)
                all_blogs_dict['page'] = cursor.urlsafe().decode("utf-8")
            all_blogs_dict['hasmore'] = hasmore
            # #logging.info(dict)
            return jsonify(all_blogs_dict)
    return []

@app.route('/api/task/notification',methods=['POST'])       
def pushtasks():
    payload = dict(request.get_json()) or '(empty payload)'
  
    print(f'Received task with payload: {payload} ')
    with client.context():
        followers = Followers.query(Followers.following == payload.get('user')).fetch()
        for follower in followers:
                pushapi(follower=follower.follower,author=payload.get('user'),title=payload.get('title'), id=payload.get('id'))
        return "done"

@app.route('/api/task/newsletter',methods=['POST'])
def sendmail_task():
    payload = dict(request.get_json())
    with client.context():
        subscribers_to = Users.query(Users.username==payload.get('user')).get().email
        subscribers = NewsLetter.query(NewsLetter.subscribed_to==subscribers_to).fetch()
        for subscriber in subscribers:
            newslettermail(subscriber_mail=subscriber.subscriber,author_email=subscribers_to,author=payload.get('user'),title=payload.get('title'), id=payload.get('id'))
            print(subscriber.subscriber)
    return 'done'

@app.route('/api/post',methods=['POST'])                                                  # To submit a blog post 
@jwt_required()
def add():
    data = dict(request.get_json())
    current_user = get_jwt_identity()
    with client.context():
        
        post = Blog_Info(username=current_user,
                        date=datetime.utcnow(),
                        article_title=data.get('title'),
                        article_body=data.get('body'),
                        tag=data.get("tag") if data.get('tag') else "Miscellenious"
                        )
        post.put()
        #create task here
        # create_task(payload=jsonify({"user":current_user})
        task = {
            "user":current_user,
            "title":data.get('title'),
            "id": post.key.id(),
        }
        create_task(payload=task,endpoint='/api/task/notification')
        create_task(payload=task,endpoint='/api/task/newsletter')
        return jsonify({"message":"success"})

@app.route('/api/update/<int:id>',methods=['PUT'])                                        # To update a submitted post (Work in progress)
@jwt_required()
def update(id):
    with client.context():
        data = dict(request.get_json())
        blog = Blog_Info.get_by_id(id)
        blog.article_title = data.get('title')
        blog.article_body = data.get('content')
        blog.put()
        return jsonify({"message":"success"})

@app.route('/delete/<int:id>',methods=['DELETE'])                                         # To delete a published post(work in progress)
@jwt_required()
def delete(id):
    with client.context():
        blog = Blog_Info.get_by_id(id)
        deleted_blog = blog.to_dict()
        deleted_blog['id'] = id
        blog.key.delete()
        return jsonify({"message":"Successfully Deleted","blog":deleted_blog})

@app.route('/api/follow',methods=['PUT'])
@jwt_required()                                                                           # To allow users to follow or unfollow a particular user
def follow():
    data = request.get_json()
    with client.context():
       
        isFollowing = Followers.query(Followers.follower==data['follower'],Followers.following==data['following']).get()
        if isFollowing is not None:
            isFollowing.key.delete()
            return jsonify({"message":"unfollowed"})

        follow_data = Followers(follower=data['follower'],following=data['following'])
        follow_data.put()

    return jsonify({"message":"following"})

@app.route('/api/feed',methods=['POST'])                                                   # To get all the post of the user's followers
@jwt_required()
def feed():
    current_user = get_jwt_identity()
    data = dict(request.get_json())
    print(data)
    with client.context():
        following = [user.following for user in Followers.query(Followers.follower == current_user).fetch()]
        # print(following)
        
 
        blogs = Blog_Info.query(Blog_Info.username.IN(following)).order(-Blog_Info.date).iter(limit=5,offset=data.get('page')*5)
        # print(blogs)
     
        all_user_post = {
            "result":[],
            "hasmore":True
        }
        try:
            if blogs:
                for blog in blogs:
                    data_to_append = blog.to_dict()
                    profile = Users.query(Users.username==data_to_append.get('username')).get()
                    data_to_append["picture"] = profile.profile_picture
                    data_to_append["id"] = blog.key.id()
                    data_to_append['likes'] = len(Likes.query(Likes.liked_post==data_to_append['id']).fetch())
                    data_to_append['comments'] = len(Comments.query(Comments.post ==data_to_append['id']).fetch())
                    all_user_post['result'].append(data_to_append)
                return jsonify(all_user_post)
            all_user_post['hasmore'] = False
        except:                                             # BadQueryError
            all_user_post['hasmore'] = False
        return jsonify(all_user_post)   

@app.route('/api/favorite',methods=['POST'])                                                # To add post to favorites
@jwt_required()
def favorite():
    data = dict(request.get_json())
    user = get_jwt_identity()
    with client.context():
        post_already_exists = Favorite_post.query(Favorite_post.user==user,Favorite_post.post==data.get('post')).get()
        if post_already_exists is None:
            favorite_post = Favorite_post(user=user,post=data.get('post'))
            favorite_post.put()
            return jsonify({'message':'Added to Favorites'})
        post_already_exists.key.delete()
        return jsonify({'message':'Removed from Favorites'})

@app.route('/api/getfavorites', methods=['POST'])
@jwt_required()
def getfavorites():
    user = get_jwt_identity()
    data = dict(request.get_json())
    if data.get('hasmore'):
        curse = None
        if data.get('page'):
            curse = Cursor(urlsafe=data.get('page'))
        with client.context():
            favorite_posts,cursor,hasmore = Favorite_post.query(Favorite_post.user==user).fetch_page(5,start_cursor=curse)
            result_dict = {
                "result":[],
                "page":None
            }
            if favorite_posts:
                for post in favorite_posts:
                    blog = Blog_Info.get_by_id(post.post)
                    data_to_append = blog.to_dict()
                    user = Users.query(Users.username==data_to_append.get('username')).get()
                    data_to_append["picture"] = user.profile_picture
                    data_to_append['likes'] = len(Likes.query(Likes.liked_post==post.post).fetch())
                    data_to_append['comments'] = len(Comments.query(Comments.post ==post.post).fetch())
                    data_to_append['id'] = post.post
                    result_dict['result'].append(data_to_append)
                result_dict['page'] = cursor.urlsafe().decode("utf-8")
            result_dict['hasmore'] = hasmore
            return jsonify(result_dict)
    return []

@app.route('/api/like',methods=['POST'])
@jwt_required()
def like():
    data = dict(request.get_json())
    user = get_jwt_identity()
    with client.context():
        already_liked = Likes.query(Likes.liked_by==user,Likes.liked_post==data.get('post')).get()
        if already_liked is None:
            new_like = Likes(
                liked_by=user,
                liked_post=data.get('post')
            )
            new_like.put()
            return jsonify({'msg':"liked"})
        already_liked.key.delete()
        return jsonify({'msg':'unliked'})


@app.route('/api/getcomments', methods=['POST'])
def getcomments():
    data = dict(request.get_json())
    with client.context():
        comments =  Comments.query(Comments.post==int(data.get('id'))).iter()
        comments_dict = []
        for data in comments:
            comment = data.to_dict()
            user = Users.query(Users.username==comment.get('user')).get()
            comment["picture"] = user.profile_picture
            comment['id'] = data.key.id()
            comments_dict.append(comment)
        return comments_dict

@app.route('/api/comment',methods=['POST'])
@jwt_required()
def comment():
    data = dict(request.get_json())
    user = get_jwt_identity()
    with client.context():
        comment = Comments(
            user = user,
            post = int(data.get('id')),
            comment=data.get('comment'),
            date = datetime.utcnow()
        )
        comment.put()
        return jsonify({"msg":"posted"})
    

@app.route("/api/notifications", methods=["GET"])
@jwt_required()                                                                            # To check if the user has allowed notifications 
def notifications():
    user = get_jwt_identity()
    #logging.info(data)
    with client.context():
        user = Users.query(Users.username == user).get()
        #logging.info(user.notifications)
        if user.notifications:
            return jsonify({"message":True})
    return jsonify({"message":False})


@app.route("/api/subscription",methods=['POST'])                                            # To store the subscription endpoints and keys of a user
@jwt_required()
def subscription():
    data = dict(request.get_json())
    user = get_jwt_identity()
    #logging.info(data.get('sub'))
    with client.context():
        user = Users.query(Users.username == user).get()
        if data.get('sub'):
            user.notifications = True
            user.subscription_info = data.get('sub')
            user.put()
            return jsonify({"message":"subscribed"})
        user.notifications = False
        user.subscription_info = None
        user.put()
        return jsonify({"message":"unsubscribed"})

@app.route('/api/mailsubscription',methods=['POST'])
@jwt_required()
def newsletter_subscription():
    user = get_jwt_identity()
    data = dict(request.get_json())
    with client.context():
        user_mail = Users.query(Users.username==user).get().email
        subscribers_mail = Users.query(Users.username==data.get('subscribingTo')).get().email
        is_subscribed = NewsLetter.query(NewsLetter.subscriber==user_mail,NewsLetter.subscribed_to==subscribers_mail).get()
        if is_subscribed is not None:
            is_subscribed.key.delete()
            return jsonify({'message':'Unsubscribed'})
        newsletter_subscriber = NewsLetter(subscriber=user_mail,subscribed_to=subscribers_mail)
        newsletter_subscriber.put()
    return jsonify({"message":"Subscribed!"})


@app.route("/api/tag/<tag>",methods=['POST'])
def filter_tag(tag):
    data = dict(request.get_json())
    curse = None
    if data.get('page'):
        curse = Cursor(urlsafe=data.get('page'))
    tag = tag.capitalize()
  
    with client.context():
        filtered_post, cursor, hasmore = Blog_Info.query(Blog_Info.tag==tag).fetch_page(10,start_cursor=curse)
        
        result_dict = {
                "result": [],
                "page": None
            }
            
        if filtered_post:
            for data in filtered_post:
                blog = data.to_dict()
                user = Users.query(Users.username==blog.get('username')).get()
                blog["picture"] = user.profile_picture       
                blog["id"] = data.key.id()
                blog['likes'] = Likes.query(Likes.liked_post==blog.get('id')).count()
                blog['comments'] = Comments.query(Comments.post ==blog.get('id')).count()
                result_dict['result'].append(blog)
                
            result_dict['page'] = cursor.urlsafe().decode("utf-8")
        result_dict['hasmore'] = hasmore

        
        return result_dict


@app.route('/api/auth/admin_login',methods=['POST'])
def admin():
    data = dict(request.get_json())
    if data.get('username') == 'admin' and data.get('password') == 'test':
        return jsonify({'message':'success'})
    return jsonify({'error':'Failed to login'}),401

@app.route("/api/delete_all",methods=['POST'])
def delete_all():
    data = dict(request.get_json()).get('model')
    with client.context():
        if data == 'user':
            ndb.delete_multi(
                Users.query().iter(keys_only=True)
            )
            return jsonify({'message':'success'})
        if data == 'blogs':
            ndb.delete_multi(
                Blog_Info.query().iter(keys_only=True)
            )
            return jsonify({'message':'success'})
        if data == 'follower':
            ndb.delete_multi(
                Followers.query().iter(keys_only=True)
            )
            return jsonify({'message':'success'})
        if data == 'tokens':
            ndb.delete_multi(
                ValidationTokens.query().iter(keys_only=True)
            )
            return jsonify({'message':'success'})
    return jsonify({'message':'model not found'})