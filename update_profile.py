import stock_transaction_implementation as stock_transaction
import models

# 'UBER': {'quantity': 10, 'averagePrice': 32.08, 'currentPrice' : 60},
def getUserStockDataFromDB(data, db):

    response = dict()

    userName = data['userEmail']
    # get the users username_id
    dbUserId = db.session.query(models.USERS).filter_by(username=userName).first().username_id
    #get the stocks owned by that user to get their potential assets
    stocksOwnedByUser = db.session.query(models.STOCKS).filter_by(username_id=dbUserId).all()
    # pass in tickerSymbol to helper function to get data !!!!PSA This might not be a list!!!!
    for tableData in stocksOwnedByUser:
        stock = tableData.ticker
        quantity = tableData.quantity
        averagePrice = tableData.avg_price
        currentPrice = stock_transaction.helper_get_stock_price(stock)
        
        # DICT TO STORE DATA LIKE: {'quantity': 10, 'averagePrice': 32.08, 'currentPrice' : 60}
        dataRes = dict()
        dataRes['quantity'] = quantity
        dataRes['averagePrice'] = averagePrice
        dataRes['currentPrice'] = currentPrice
        
        #FINAL RETURN DICT TO STORE DATA LIKE
        response[stock] = dataRes

    return response

def getCashBalance(data, db):
    response = dict()
    
    userName = data['userEmail']
    
    userId = db.session.query(models.USERS).filter_by(username=userName).first().username_id
    cashBalance = db.session.query(models.USERS).filter_by(username=userName).first().cash_balance
    
    response['cashBalance'] = cashBalance
    response['userId'] = userId
    
    return response