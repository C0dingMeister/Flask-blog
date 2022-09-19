from flask import request,jsonify
from app.models import Users, Blog_Info,Followers,client
from app import app,bcrypt
from PIL import Image
import os
import json
import secrets
import uuid
from app.validEmail import check
from datetime import datetime
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token,create_refresh_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

#for webpush
from pywebpush import webpush, WebPushException


@app.route("/refresh", methods=["POST"])                                                # refreshes the token (work in progress)
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)

@app.route('/setdp',methods=['PUT'])                                                    # Allows the change of profile picture (work in progress)
@jwt_required()
def setdp():
    file = request.files.get('avatar')
    current_user = get_jwt_identity()
    with client.context():
        user = Users.query(Users.username==current_user).get()
        filename = secure_filename(file.filename)
        extension = filename.split('.')[1]
        new_filename = secrets.token_hex(16)
        print(new_filename)
        output_size = (150,150)
        resized_image = Image.open(file)
        resized_image.thumbnail(output_size)
        print("saving")
        resized_image.save(os.path.join('app/static/profile_pic/', new_filename + '.' + extension))
        print("saved")
        user.profile_picture = f'static/profile_pic/{new_filename}.{extension}'
        user.put()
        message = {
            "message":"uploaded successfully!",
            "dp":user.profile_picture  
        }
    return jsonify(message)

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
        message = {
                    "profile":user.profile_picture,
                    "email":user.email,
                    "about_me":user.about_me
                  }
        if Followers.query(Followers.follower==data['follower'],Followers.following==data['username']).get() is not None:
            message["following"] = True
        else:
            message["following"] = False

        return jsonify(message)

@app.route('/api/registeration',methods=['POST'])                                        # To register a new user. Checks for unique username and email address and basic email validation.
@app.route('/registeration',methods=['POST'])                                               
def register():
    data = request.get_json()
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
        user = Users(uuid=uuid.uuid4().hex,
                     username=data['username'], 
                     email=data['email'],
                     password=hashed_password,
                     date=datetime.now().strftime("%m/%d/%Y, %H:%M:%S")
                    )
            
        user.put()
        print(data)
        
        return jsonify({'message':"Registered"})


@app.route('/api/login',methods=['POST'])                                                 # To login in users and provide them with jwt token
@app.route('/login',methods=['POST'])
def login():
    data = request.get_json()
    with client.context():
        user = Users.query(Users.email==data['email']).get()
        if user and bcrypt.check_password_hash(user.password,data['password']):
            access_token = create_access_token(identity=user.username,fresh=True)
            refresh_token = create_refresh_token(identity=user.username)
            message = {
                        "access_token": access_token,
                        "refresh_token": refresh_token
                      }
            # message = {
            #         "user":user.username,
            #         "message":"success",
            #         "dp":user.profile_picture,
            #         "token": access_token,
            #           }
            return jsonify(message),200
            
        
    print(data.get('email'),data.get('password'))
    
    return jsonify({'error':"Check your credentials again"}),401

@app.route('/api/get')                                                                    # To get all the post by all users
@app.route('/get')
def get():
    with client.context():
        result = [data for data in Blog_Info.query().iter()]
        dict = []
        for data in result:
            blog = data.to_dict()
            user = Users.query(Users.username==blog.get('username')).get()
            blog["picture"] = user.profile_picture       
            blog["id"] = data.key.id()
            dict.append(blog)
        return dict


@app.route('/api/latest')                                                                 # To get the three latest post (ordered by Key)
def latest():
    with client.context():
        result = [data for data in Blog_Info.query().order(-Users.key).fetch(3)]
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
        if Followers.query(Followers.follower==data.get("follower"),Followers.following==result_with_id.get('username')).get() is not None:
            result_with_id["following"] = True
        else:
            result_with_id['following'] = False
        profile = Users.query(Users.username==result_with_id.get('username')).get()
        result_with_id["picture"] = profile.profile_picture
        result_with_id["id"] = id
        return jsonify(result_with_id)

@app.route("/api/myposts",methods=["POST"])                                               # To get all post of a particular user 
def user_post():
    data = dict(request.get_json())
    
    with client.context():
        blogs = [blog for blog in Blog_Info.query(Blog_Info.username == data.get("username")).iter()]
        all_blogs = []
        for blog in blogs:
            data_to_append = blog.to_dict()
            user = Users.query(Users.username==data_to_append.get('username')).get()
            data_to_append["id"] = blog.key.id()
            data_to_append["picture"] = user.profile_picture 
            all_blogs.append(data_to_append)
        # print(dict)
        return jsonify(all_blogs)
    
@app.route('/api/post',methods=['POST'])                                                  # To submit a blog post (Work in progress)
@jwt_required()
def add():
    data = request.get_json()
    print(data)
    with client.context():
        
        user = Blog_Info(username=data['user'],
                        date=datetime.now().strftime("%m/%d/%Y, %H:%M:%S"),
                        article_title=data['title'],
                        article_body=data['body'],
                        tag=data["tag"]
                        )
        user.put()
        current_user = get_jwt_identity()
        user_json = user.to_dict()
        user_json["id"] = user.key.id()
        return jsonify({"message":"success","user":current_user,"newBlog":user_json})

@app.route('/update/<int:id>',methods=['PUT'])                                            # To update a submitted post (Work in progress)
@jwt_required()
def update(id):
    with client.context():
        data = request.get_json()
        blog = Blog_Info.get_by_id(id)
        blog.article_title = data['title']
        blog.article_body = data['body']
        blog.put()
        edited_blog = blog.to_dict()
        edited_blog["id"] = blog.key.id()
        return jsonify({"message":"success","blog":edited_blog})


@app.route('/delete/<int:id>',methods=['DELETE'])                                         # To delete a published post(work in progress)
@jwt_required()
def delete(id):
    with client.context():
        blog = Blog_Info.get_by_id(id)
        deleted_blog = blog.to_dict()
        deleted_blog['id'] = id
        blog.key.delete()
        return jsonify({"message":"Successfully Deleted","blog":deleted_blog})

@app.route('/api/follow',methods=['PUT'])                                                 # To allow users to follow or unfollow a particular user
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


@app.route('/api/feed',methods=['GET'])                                                   # To get all the post of the user's followers
@app.route('/feed',methods=['GET'])
@jwt_required()
def feed():
    current_user = get_jwt_identity()
    with client.context():
        following = Followers.query(Followers.follower == current_user).fetch()
        
        followers_posts = []
        for user in following:
            blogs =[blog for blog in Blog_Info.query(Blog_Info.username == user.following).iter()]
            all_user_post = []
            for blog in blogs:
                data_to_append = blog.to_dict()
                profile = Users.query(Users.username==data_to_append.get('username')).get()
                data_to_append["picture"] = profile.profile_picture
                data_to_append["id"] = blog.key.id()
                all_user_post.append(data_to_append)
            followers_posts +=all_user_post
            
    return followers_posts


@app.route("/push", methods=["POST"])                                                     # for push notifications (work in progress)
def push():
  result = "OK"
  #change the subscription info and save it in the database
  try:
    webpush(
      subscription_info ={"endpoint":"https://fcm.googleapis.com/fcm/send/c3I3jDcPNVQ:APA91bFmmg3JpyjQsKDpIvtEw-3kv1clhHONcMiHWPcJz-mRFbcJEKQCHWJqYrBj-bnswiUmfEpod3MqT5LMZKNMT6-DuO4fpiSbU5YeeW9DKy1YCpTPLci_kuMu0l6NHlw3gpyz0MG_","expirationTime":None,"keys":{"p256dh":"BPMh-J1ZzHjE40cTuWUhcz9RJYM4l3U0uotBRCQa9eWAS28RrZe3g_TjOZ7YOX8p0Qs98ubsncVyty65ZTCEsTc","auth":"nO2zE-HTJqq5WTvD4DkX7g"}},
      data = json.dumps({
        "title" : "Welcome!",
        "body" : "this is working great!!",
        "icon" : "http://localhost:5000/app/i-loud.png",
        "image" : "http://localhost:5000/i-zap.png",
      
      }),
      vapid_private_key = app.config['VAPID_PRIVATE'],
      vapid_claims = { "sub":app.config['VAPID_SUBJECT']  }
    )

    #If any exception, delete the subscription
  except WebPushException as ex:
    print(ex)
    result = "FAILED"
  return result
