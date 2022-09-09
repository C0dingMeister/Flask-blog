from email.policy import default
import os
import google.auth.credentials
from google.cloud import ndb
import mock


os.environ["DATASTORE_DATASET"] = "blog"
os.environ["DATASTORE_EMULATOR_HOST"] = "localhost:8001"
os.environ["DATASTORE_EMULATOR_HOST_PATH"] = "localhost:8001/datastore"
os.environ["DATASTORE_HOST"] = "http://localhost:8001"
os.environ["DATASTORE_PROJECT_ID"] = "blog"

credentials = mock.Mock(spec=google.auth.credentials.Credentials)
client = ndb.Client(project="blog", credentials=credentials)


# gcloud beta emulators datastore start --data-dir=. --project blog --host-port "127.0.0.1:8001
# $env:DATASTORE_EMULATOR_HOST='localhost:8001';python .\venv\Scripts\datastore-viewer

class Users(ndb.Model):
    uuid = ndb.StringProperty(required=True)
    profile_picture = ndb.TextProperty(default='/static/profile_pic/default.png')
    username = ndb.StringProperty(required=True)
    email = ndb.StringProperty(required=True)
    password = ndb.StringProperty(required=True)
    date = ndb.StringProperty()


class Blog_Info(ndb.Model):
    username = ndb.StringProperty(required=True)
    date = ndb.StringProperty() 
    article_title = ndb.StringProperty(required=True)
    article_body = ndb.StringProperty(required=True)

class Followers(ndb.Model):
    following = ndb.StringProperty()
    follower = ndb.StringProperty()