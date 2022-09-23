import os
import google.auth.credentials
from google.cloud import ndb
import mock

if os.getenv('GAE_ENV', '').startswith('standard'):
    # production
    client = ndb.Client()
else:
    #localhost
    os.environ["DATASTORE_DATASET"] = "microblog"
    os.environ["DATASTORE_EMULATOR_HOST"] = "localhost:8001"
    os.environ["DATASTORE_EMULATOR_HOST_PATH"] = "localhost:8001/datastore"
    os.environ["DATASTORE_HOST"] = "http://localhost:8001"
    os.environ["DATASTORE_PROJECT_ID"] = "microblog"

    credentials = mock.Mock(spec=google.auth.credentials.Credentials)
    client = ndb.Client(project="microblog", credentials=credentials)


# gcloud beta emulators datastore start --data-dir=. --project microblog --host-port "127.0.0.1:8001
# $env:DATASTORE_EMULATOR_HOST='localhost:8001';python .\venv\Scripts\datastore-viewer

class Users(ndb.Model):
    uuid = ndb.StringProperty(required=True)
    profile_picture = ndb.TextProperty(default='static/profile_pic/default.png')
    username = ndb.StringProperty(required=True)
    email = ndb.StringProperty(required=True)
    password = ndb.StringProperty(required=True)
    about_me = ndb.StringProperty(default="Just an aspiring writer")
    date = ndb.DateTimeProperty() 
    notifications = ndb.BooleanProperty(default=False)
    subscription_info = ndb.JsonProperty(default=None)
    
class Blog_Info(ndb.Model):
    username = ndb.StringProperty(required=True)
    date = ndb.DateTimeProperty() 
    article_title = ndb.StringProperty(required=True)
    article_body = ndb.TextProperty(required=True)
    tag = ndb.StringProperty(default="Miscelleneous")

class Followers(ndb.Model):
    following = ndb.StringProperty()
    follower = ndb.StringProperty()

class NewsLetter(ndb.Model):
    subscriber = ndb.StringProperty()
    subscribed_to = ndb.StringProperty()