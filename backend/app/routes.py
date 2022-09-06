from flask import request,jsonify,url_for
from app.models import Users, Blog_Info,client
from app import app,bcrypt
from PIL import Image
import os
import secrets
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required


@app.route("/token", methods=["POST"])
def create_token():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if username != "test" or password != "test":
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

@app.route('/setdp',methods=['PUT'])
@jwt_required()
def setdp():
    file = request.files.get('avatar')
    current_user = get_jwt_identity()
    with client.context():
        user = Users.query(Users.username==current_user).get()
        filename = secure_filename(file.filename)
        extension = filename.split('.')[1]
        new_filename = secrets.token_hex(16)
        
        output_size = (150,150)
        resized_image = Image.open(file)
        resized_image.thumbnail(output_size)
        resized_image.save(os.path.join('static/profile_pic/', new_filename+'.'+extension))
        user.profile_picture = f'static/profile_pic/{new_filename}.{extension}'
        user.put()
        message = {
            "message":"uploaded successfully!",
            "dp":user.profile_picture  
        }
    return jsonify(message)

@app.route("/getuser", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    with client.context():
        user = Users.query(Users.username==current_user).get()
        message = {
            "logged_in_as": current_user,
            "dp": user.profile_picture
        }

    return jsonify(message), 200


@app.route('/registeration',methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    with client.context():
        
        if Users.query(Users.username==data['username']).get() is not None:
            return jsonify({"message":"Username already exits!"})
        elif Users.query(Users.email==data['email']).get() is not None:
            return jsonify({"message":"Email already registered!"})
        

        user = Users(uuid=uuid.uuid4().hex,
                    username=data['username'], 
                    email=data['email'],
                    password=hashed_password,
                    date=datetime.now().strftime("%c")
                    )
            
        user.put()
        print(data)
        
        return jsonify({'message':"Registered"})

@app.route('/login',methods=['POST'])
def login():
    data = request.get_json()
    with client.context():
        user = Users.query(Users.email==data['email']).get()
        if user and bcrypt.check_password_hash(user.password,data['password']):
            access_token = create_access_token(identity=user.username)
            message = {
                    "user":user.username,
                    "message":"success",
                    "dp":user.profile_picture,
                    "token": access_token,
                      }
            return jsonify(message)
            
        
    print(data.get('email'),data.get('password'))
    
    return jsonify({'message':"Check your credentials again"})

@app.route('/get')
def get():
    
    with client.context():
        result = [data for data in Blog_Info.query().iter()]
        dict = []
        for data in result:       
            # data_to_append = {
            #     "id": data.key.id(),
            #     "username": data.username,
            #     "email":data.email,
            #     "article_title":data.article_title,
            #     "article_body":data.article_body
            # }
            data_to_append = data.to_dict()
            data_to_append["id"] = data.key.id()
            dict.append(data_to_append)
             
            # response.headers.add('Access-Control-Allow-Origin', '*')
        return jsonify(dict)

@app.route('/get/<int:id>')
def get_by_id(id):
    with client.context():
        result = Blog_Info.get_by_id(id)
        result_with_id = result.to_dict()
        result_with_id["id"] = id
        return jsonify(result_with_id)

@app.route("/myposts",methods=["POST"])
@jwt_required()
def user_post():
    # data = request.get_json()
    current_user = get_jwt_identity()
    with client.context():
        blogs = [blog for blog in Blog_Info.query(Blog_Info.username == current_user).iter()]
        dict = []
        for blog in blogs:
            data_to_append = blog.to_dict()
            data_to_append["id"] = blog.key.id()
            dict.append(data_to_append)
        # print(dict)
        return jsonify(dict)
    
@app.route('/post',methods=['POST'])
@jwt_required()
def add():
    data = request.get_json()
    print(data)
    with client.context():
        
        user = Blog_Info(username=data['user'],
        date=datetime.now().strftime("%c"),
        article_title=data['title'],
        article_body=data['body']
        )
        user.put()
        current_user = get_jwt_identity()
        user_json = user.to_dict()
        user_json["id"] = user.key.id()
        return jsonify({"message":"success","user":current_user,"newBlog":user_json})

@app.route('/update/<int:id>',methods=['PUT'])
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


@app.route('/delete/<int:id>',methods=['DELETE'])
@jwt_required()
def delete(id):
    with client.context():
        blog = Blog_Info.get_by_id(id)
        deleted_blog = blog.to_dict()
        deleted_blog['id'] = id
        blog.key.delete()
        return jsonify({"message":"Successfully Deleted","blog":deleted_blog})