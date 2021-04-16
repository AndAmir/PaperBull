import React, { useState, useEffect } from "react";
import "./StockTransaction.css";
import PropTypes from "prop-types";

import { socket } from "./App.js";

export const STOCK_TRANSACTION_MODES = { buy: "Buy", sell: "Sell"};

export function StockTransaction({
    transaction_mode, 
    user_id, 
    ticker_symbol, 
    display_screen_func
  }) {
  //const [isAfterMatchVisible, changeAfterMatchVisibility] = useState(false);
  const [valueOfStock, updateStockValue] = useState(0.00);
  const [amountOfStockOwned, updateAmountOfStockOwned] = useState(0);
  const [moneyDeltaValue, updateMoneyDelta] = useState(0.00);
  
  const headerText = transaction_mode;
  const valueOfStockStr = `$${valueOfStock.toFixed(2)}`;
  
  const amountofStockPrompStr = 
    `Quantity of stock to ${transaction_mode.toLowerCase()}`;
  
  const moneyDeltaStr = `Money ${transaction_mode === "Buy"? "Lost": "Gained"}`;
  const moneyDeltaValueStr = 
    `${transaction_mode === "Buy"? "-": "+"} $${valueOfStock.toFixed(2)}`;
  
  const confirmText = `Confirm ${transaction_mode}`;
  
  useEffect(() => {
    //socket.on("afterMatchReport", (data) => {});
  }, []);

  return (
    <div class="stockTransactionComponent">
      <div class="stockTransactionInnerDiv">
        <div class="headerText"> {headerText} </div>
        <table class="stockTransactionTable">
          <tr class="tickerInfo">
            <td class="leftAlign"> {ticker_symbol} </td>
            <td class="rightAlign"> {valueOfStockStr} </td>
          </tr>
          <tr class="currentlyOwned">
            <td class="leftAlign"> Currently Owned </td>
            <td class="rightAlign"> {amountOfStockOwned} </td>
          </tr>
          <tr class="amountOfStocks">
            <td class="leftAlign"> {amountofStockPrompStr} </td>
            <td class="rightAlign"> <input type="number" placeholder="0"/> </td>
          </tr>
          <tr class="moneyDelta">
            <td class="leftAlign"> {moneyDeltaStr} </td>
            <td class="rightAlign"> {moneyDeltaValueStr} </td>
          </tr>
        </table>
        <div class="confirmButton"> {confirmText} </div>
      </div>
    </div>
  );
}

StockTransaction.propTypes = {
  transaction_mode: PropTypes.string.isRequired,
  user_id: PropTypes.number.isRequired,
  ticker_symbol: PropTypes.string.isRequired,
  display_screen_func: PropTypes.func.isRequired
};