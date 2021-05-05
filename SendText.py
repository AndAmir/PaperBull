import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
from datetime import datetime
import time
import os
from dotenv import load_dotenv, find_dotenv
import stockquotes
load_dotenv(find_dotenv())

def send_email(toEmail, subject, body):
    # server = smtplib.SMTP('smtp.gmail.com:587')
    # server.ehlo()
    # server.starttls()
    # server.login('paperbullnotification@gmail.com', os.getenv('EMAIL_PASS'))

    msg = MIMEMultipart()
    msg['From'] = 'paperbullnotification@gmail.com'
    msg['To'] = toEmail
    msg['Subject'] = subject
    msg.attach(MIMEText('\n'+body+"\n", 'plain'))
    text = msg.as_string()
    server.sendmail('paperbullnotification@gmail.com', toEmail, text)
    # server.quit()


numbers = ["12015099113@tmomail.net"]


#send_email(numberDict[0],'STOCK PRICE DROP','GME IS GOING DOWN')

def text(toEmail, subject, body):
    server = smtplib.SMTP('smtp.gmail.com:587')
    server.ehlo()
    server.starttls()
    server.login('paperbullnotification@gmail.com', os.getenv('EMAIL_PASS'))

    msg = MIMEMultipart()
    msg['From'] = 'paperbullnotification@gmail.com'
    msg['To'] = toEmail
    msg['Subject'] = subject
    msg.attach(MIMEText('\n'+body+"\n", 'plain'))
    text = msg.as_string()
    server.sendmail('paperbullnotification@gmail.com', toEmail, text)
    server.quit()

def massText(numberList, subject, body):
    server = smtplib.SMTP('smtp.gmail.com:587')
    server.ehlo()
    server.starttls()
    server.login('paperbullnotification@gmail.com', os.getenv('EMAIL_PASS'))
    for number in numberList:
        msg = MIMEMultipart()
        msg['From'] = 'paperbullnotification@gmail.com'
        msg['To'] = number
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        text = msg.as_string()
        server.sendmail('paperbullnotification@gmail.com',number, text)
        send_email(number,subject,body)
    server.quit()
