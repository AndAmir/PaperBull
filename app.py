import os
import stock_transaction_implementation as stock_transaction
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

APP = Flask(__name__, static_folder='./build/static')

APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(APP)

import models
db.create_all()

cors = CORS(APP, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    APP,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')
    
@socketio.on('pollStock')
def poll_stock(data):
    return stock_transaction.poll_stock_implementation(data, db)
    
@socketio.on('requestUserStockInfo')
def request_user_stock_info(data):
    return stock_transaction.request_user_stock_info_implementation(data, db)
    
@socketio.on('processTransaction')
def process_transaction(data):
    return stock_transaction.process_transaction_implementation(data, db)

if __name__ == "__main__":
    socketio.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
