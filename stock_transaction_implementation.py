import random

def poll_stock_implementation(data):
    stock = data['ticker_symbol']
    print(stock)
    return {stock: random.randint(0, 100)}