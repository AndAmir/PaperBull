import React, { useState, useEffect } from "react";
import "./StockTransaction.css";
import PropTypes from "prop-types";

import { socket } from "./App.js";

export const STOCK_TRANSACTION_MODES = { Buy: "BUY", Sell: "SELL"};

function StockTransaction({
    transaction_mode, 
    user_id, 
    ticker_symbol, 
    display_screen_func
  }) {
  //const [isAfterMatchVisible, changeAfterMatchVisibility] = useState(false);

  useEffect(() => {
    //socket.on("afterMatchReport", (data) => {});
  }, []);

  return (
    <div>
    </div>
  );
}

StockTransaction.propTypes = {
  //waitingToPlayAgainState: PropTypes.number.isRequired,
};

export default StockTransaction;