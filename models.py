from app import db as DB


class USERS(DB.Model):
    """
    Creates the tabel for the heroku database
    """

    username_id = DB.Column(DB.Integer, unique=True, nullable=False, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    cash_balance = DB.Column(DB.Float, nullable=False)
    __tablename__ = "USERS"

    def __repr__(self):
        return "<Player %r>" % self.username


class STOCKS(DB.Model):
    stock_instance_id = DB.Column(
        DB.Integer, unique=True, nullable=False, primary_key=True
    )
    username_id = DB.Column(
        DB.Integer, DB.ForeignKey("USERS.username_id"), nullable=False
    )
    ticker = DB.Column(DB.String(80), nullable=False)
    quantity = DB.Column(DB.Float, nullable=False)
    avg_price = DB.Column(DB.Float, nullable=False)
    __tablename__ = "STOCKS"

    def __repr__(self):
        return '<Player %r>' % self.username_id
        
# action_type IS EITHER "buy" or "sell"
class HISTORY(DB.Model):
    history_instance_id = DB.Column(
        DB.Integer, unique=True, nullable=False, primary_key=True
    )
    username_id = DB.Column(
        DB.Integer, DB.ForeignKey("USERS.username_id"), nullable=False
    )
    date = DB.Column(DB.DateTime, nullable=False)
    stock = DB.Column(DB.String(80), nullable=False)
    quantity = DB.Column(DB.Float, nullable=False)
    action_type = DB.Column(DB.String(80), nullable=False)
    change_in_money = DB.Column(DB.Float, nullable=False)
    __tablename__ = "HISTORY"

    def __repr__(self):
        return "<Player %r>" % self.username_id
