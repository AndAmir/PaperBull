import stock_transaction_implementation as stock_module
import models

# 'UBER': {'quantity': 10, 'averagePrice': 32.08, 'currentPrice' : 60},
def getUserStockDataFromDB(data, db):

    response = dict()

    userName = data["userEmail"]
    # get the users username_id
    userID = (
        db.session.query(models.USERS).filter_by(username=userName).first().username_id
    )
    # get the stocks owned by that user to get their potential assets
    stocksOwnedByUser = (
        db.session.query(models.STOCKS).filter_by(username_id=userID).all()
    )
    # pass in tickerSymbol to helper function to get data !!!!PSA This might not be a list!!!!
    for tableData in stocksOwnedByUser:
        stock = tableData.ticker
        quantity = tableData.quantity
        averagePrice = tableData.avg_price
        currentPrice = stock_module.StockDataAccess.get_instance().get_stock_price(
            stock
        )

        # DICT TO STORE DATA LIKE: {'quantity': 10, 'averagePrice': 32.08, 'currentPrice' : 60}
        dataRes = dict()
        dataRes["quantity"] = quantity
        dataRes["averagePrice"] = averagePrice
        dataRes["currentPrice"] = currentPrice

        # FINAL RETURN DICT TO STORE DATA LIKE
        response[stock] = dataRes

    return response


def getCashBalance(data, db):
    response = dict()

    userName = data["userEmail"]

    userId = (
        db.session.query(models.USERS).filter_by(username=userName).first().username_id
    )
    cashBalance = (
        db.session.query(models.USERS).filter_by(username=userName).first().cash_balance
    )

    response["cashBalance"] = cashBalance
    response["userId"] = userId

    return response


def updateLeaderBoard(db):

    response = list()

    users = db.session.query(models.USERS).all()

    for user in users:
        userName = user.username
        userCashBalance = user.cash_balance
        dataRes = dict()
        dataRes["userName"] = userName
        dataRes["userCashBalance"] = userCashBalance

        response.append(dataRes)

    for player in response:
        print(player)
        userName = player["userName"]
        userID = (
            db.session.query(models.USERS)
            .filter_by(username=userName)
            .first()
            .username_id
        )
        stocksOwnedByUser = (
            db.session.query(models.STOCKS).filter_by(username_id=userID).all()
        )
        for allStocksOwned in stocksOwnedByUser:
            quantity = allStocksOwned.quantity
            stock = allStocksOwned.ticker
            currentPrice = stock_module.StockDataAccess.get_instance().get_stock_price(
                stock
            )
            totalAmount = quantity * currentPrice
            player["userCashBalance"] += totalAmount
        user = userName.split("@")
        player["userName"] = user[0]

    return response
