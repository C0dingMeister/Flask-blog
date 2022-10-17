from app.models import Users,NewsLetter
import jwt
from datetime import datetime,timezone,timedelta
import json
from app.mail import newsmail
from pywebpush import webpush, WebPushException
from app import app

def pushapi(follower,title,author,id):
    user = Users.query(Users.username == follower).get()
    #logging.info(user.subscription_info)
    if user.subscription_info:
        
        try:
            webpush(
            subscription_info =user.subscription_info,
            data = json.dumps({
                "title" : "MicroBlog",
                "body" : f"{title} by {author}",
                "icon" : "/static/logo(256x256).ico",
                "url" : f'/post/{id}'
                
            }),
            vapid_private_key = app.config['VAPID_PRIVATE'],
            vapid_claims = { "sub":app.config['VAPID_SUBJECT']  }
            )

            #If any exception, delete the subscription
        except WebPushException as ex:
            return ex
            
    return "Done"

def newslettermail(subscriber_mail,title,author,id,author_email):
    if NewsLetter.query(NewsLetter.subscriber==subscriber_mail,NewsLetter.subscribed_to==author_email).get():
        newsmail(email=subscriber_mail, title=title, author=author, link=f'http://localhost:3000/post/{id}')
    return 'done'
    
def create_validation(payload):
    key = 'secret'
    return jwt.encode({"payload":payload,"exp": datetime.now(tz=timezone.utc) + timedelta(minutes=30)}, key, algorithm="HS256")
     
def check_validation(payload):
    key = 'secret'
    return jwt.decode(payload,key=key,algorithms="HS256")