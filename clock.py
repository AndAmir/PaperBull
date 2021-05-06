import threading
from apscheduler.schedulers.blocking import BlockingScheduler
import stockquotes

# from app import db
import models
import SendText
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
import os
import datetime

load_dotenv(find_dotenv())

APP = Flask(__name__, static_folder="./build/static")

APP.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

APP.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(APP)

import models

db.create_all()

threshhold = 0.03
stocks = db.session.query(models.STOCKS.ticker).distinct(models.STOCKS.ticker).all()
prevPrice = {}
tmp = []
for i in stocks:
    tmp.append(i[0])
stocks = tmp
for stock in stocks:
    try:
        prevPrice[stock] = stockquotes.Stock(stock).current_price
    except:
        pass
alreadyWarned = {}

sched = BlockingScheduler()
print(f"Starting Clock {datetime.datetime.now()}")


@sched.scheduled_job("interval", minutes=1)
def timed_job():
    print(f"\nStarting Stock Price Checks {datetime.datetime.now()}")
    global alreadyWarned, threshhold, stocks, prevPrice, stocks
    for stock in stocks:
        curr = stockquotes.Stock(stock).current_price
        prev = prevPrice[stock]
        print(
            f"Starting Day {stock} Price: {prev}  Current {stock} Price : {curr}   Top Threashold {prev*(1+threshhold)}   Bot Threshold {prev*(1-threshhold)}"
        )
        if (curr > prev * (1 + threshhold)) or (curr < prev * (1 - threshhold)):
            warnUsers = (
                db.session.query(models.STOCKS.username_id)
                .filter(models.STOCKS.ticker == stock)
                .all()
            )
            warnNumbers = []
            for userID in warnUsers:
                if userID in alreadyWarned.keys():
                    if stock in alreadyWarned[userID]:
                        pass
                    else:
                        alreadyWarned[userID].append(stock)
                        userCell = (
                            db.session.query(models.USERS.username)
                            .filter(models.USERS.username_id == userID)
                            .all()
                        )
                        userCell = userCell[0][0]
                        warnNumbers.append(userCell)
                else:
                    alreadyWarned[userID] = [stock]
                    userCell = (
                        db.session.query(models.USERS.username)
                        .filter(models.USERS.username_id == userID)
                        .all()[0]
                    )
                    userCell = userCell[0]
                    warnNumbers.append(userCell)
            print("sent a message about", stock, "to", warnNumbers)
            SendText.massText(
                warnNumbers,
                "PaperBull Notification",
                f"{stock} has had a significant change, you should look into it! https://paperbull.herokuapp.com/",
            )


@sched.scheduled_job("cron", day_of_week="mon-fri", hour=9, minute=45)
def scheduled_job():
    global alreadyWarned, threshhold, stocks, prevPrice, stocks
    print("Updating start of day stock priceing")
    stocks = db.session.query(models.STOCKS).distinct(models.STOCKS.ticker)
    prevPrice = {}
    alreadyWarned = {}
    for stock in stocks:
        prevPrice[stock] = stockquotes.Stock(stock).current_price


sched.start()
