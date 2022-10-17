from __future__ import print_function
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
import os
from pprint import pprint
from dotenv import load_dotenv
load_dotenv()

configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = os.getenv("MAIL_API")

api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

def newsmail(email,title,link,author):
    
    subject = f'{title} by {author}'
    html_content = f"<html><body><h3>Hey, {author.capitalize()} just posted a new blog. Checkout the full post by clicking here: <a href={link}>{title} by {author}</a></h3></body></html>"
    sender = {"name":"Akshat Sharma","email":"derfachmann14@gmail.com"}
    to = [{"email":email,"name":"Jane Doe"}]

    reply_to = {"email":"bhaihaikya14@gmail.com","name":"John Doe"}
    headers = {"content-type":"application/json","accept":"application/json","api-key":configuration.api_key['api-key']}
    # params = {"parameter":"My param value","subject":"New Subject"}
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(to=to, reply_to=reply_to, headers=headers, html_content=html_content, sender=sender, subject=subject)

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        pprint(api_response)
    except ApiException as e:
        print("Exception when calling SMTPApi->send_transac_email: %s\n" % e)

def validation_mail(auth_link,email):
    
    subject = 'Microblog: Validate your email address'
    html_content = f'''<html>
    <body>
    <h3>Hey, click this link to verify your email: </h3>
    <a href={auth_link}>validate email</a>
    </body>
    </html>
    '''
    sender = {"name":"Microblog support","email":"derfachmann14@gmail.com"}
    to = [{"email":email,"name":"Jane Doe"}]

    # reply_to = {"email":"bhaihaikya14@gmail.com","name":"John Doe"}
    headers = {"content-type":"application/json","accept":"application/json","api-key":configuration.api_key['api-key']}
    # params = {"parameter":"My param value","subject":"New Subject"}
    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(to=to, headers=headers, html_content=html_content, sender=sender, subject=subject)

    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        pprint(api_response)
    except ApiException as e:
        print("Exception when calling SMTPApi->send_transac_email: %s\n" % e)