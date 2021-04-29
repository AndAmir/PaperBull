"""Flask Backend"""
import os
import stock_transaction_implementation as stock_transaction
import update_profile as up
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

APP = Flask(__name__, static_folder="./build/static")

APP.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")

APP.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(APP)

import models

db.create_all()

cors = CORS(APP, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@APP.route("/", defaults={"filename": "index.html"})
@APP.route("/<path:filename>")
def index(filename):
    """Default filename function"""
    return send_from_directory("./build", filename)


# When a client connects from this Socket connection, this function is run
@socketio.on("connect")
def on_connect():
    """When a client connects from this Socket connection, this function is run"""
    print("User connected!")


# When a client disconnects from this Socket connection, this function is run
@socketio.on("disconnect")
def on_disconnect():
    """When a client disconnects from this Socket connection, this function is run"""
    print("User disconnected!")


@socketio.on("pollStock")
def poll_stock(data):
    return stock_transaction.poll_stock_implementation(data, db)


@socketio.on("requestUserStockInfo")
def request_user_stock_info(data):
    return stock_transaction.request_user_stock_info_implementation(data, db)


@socketio.on("processTransaction")
def process_transaction(data):
    return stock_transaction.process_transaction_implementation(data, db)
    
@socketio.on('updatePortfolio')
def updatePortfolio(data):
    print(data)
    return up.getUserStockDataFromDB(data, db)
    
@socketio.on('updateCashBalance')
def updateCashBalance(data):
    print(data)
    return up.getCashBalance(data, db)
    


@socketio.on("requestStockHistory")
def processStockHistory(data):
    print("Got Stock History Request!", data)
    return stock_transaction.request_ticker_history({"ticker": data})


@socketio.on("searchTicker")
def on_searchTicker(data):
    print("SEACHING TICKER")
    ticker = data["ticker"]
    socketio.emit("changeStockHistoryChart", {"ticker": ticker})


@socketio.on("login")
def on_login(data):
    """Occurs when user logs in"""
    if not validateEmail(data['currentUser']):
        return {"error": "Invalid Email"}
    exists = bool(
        models.USERS.query.filter_by(username=data['currentUser']).first())
    if not exists:
        added = add_user(data["currentUser"])
        print("Added a new user")
    # Implement Security Here. This could be a fake request
    return {
        'user': data['currentUser'],
        'name': data['userRealName']
    }

def validateEmail(email):
    if "@" in email: return True
    return False

@socketio.on('logout')
def on_logout(data):
    """Occurs when user logs out"""
    socketio.emit('logout', {
        'user': data['currentUser'],
        'name': data['userRealName']
    },
                  broadcast=True,
                  include_self=True)


def add_user(user):
    """Helper function to add a user into database"""
    new_user = models.USERS(username=user, cash_balance=10000)
    db.session.add(new_user)
    db.session.commit()
    return True


if __name__ == "__main__":
    socketio.run(
        APP,
        host=os.getenv("IP", "0.0.0.0"),
        port=8081 if os.getenv("C9_PORT") else int(os.getenv("PORT", 8081)),
        debug=True
    )
    
