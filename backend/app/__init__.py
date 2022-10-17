import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import timedelta
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=10)
app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['PROPAGATE_EXCEPTION']=True
app.config['VAPID_SUBJECT'] = os.getenv("VAPID_SUBJECT")
app.config['VAPID_PRIVATE'] = os.getenv("VAPID_PRIVATE")


jwt = JWTManager(app)
CORS(app=app,supports_credentials=True)


from app import routes