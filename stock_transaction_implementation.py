import random
import models

# TODO: We need to centralize API usage
import stockquotes


class ErrorMessages:
    INVALID_USER = "Invalid User"
    INVALID_REQUEST = "Invalid Request"
    INVALID_STOCK = "Invalid Stock"


def poll_stock_implementation(data):
    response = {}
    stock = data["ticker_symbol"]
    
    try:
        stock_data = stockquotes.Stock(stock)
        response[stock] = stock_data.current_price
        print(response[stock])
    except stockquotes.StockDoesNotExistError:
        response["error"] = ErrorMessages.INVALID_STOCK
    
    return response


def request_user_stock_info_implementation(data, db):
    response = {}

    user_id = int(data.get("user_id"))
    stock = data.get("ticker_symbol")

    db_user_stock_info = db.session.query(models.STOCKS).filter_by(
        username_id=user_id).filter_by(ticker=stock).first()

    if db_user_stock_info is None:
        response["quantity"] = 0
    else:
        response["quantity"] = db_user_stock_info.quantity
        response["avg_price"] = db_user_stock_info.avg_price

    return response
