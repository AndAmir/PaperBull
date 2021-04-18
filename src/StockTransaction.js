import React, { useRef, useState, useEffect } from "react";
import "./StockTransaction.css";
import PropTypes from "prop-types";

import { socket } from "./App.js";

export const STOCK_TRANSACTION_MODES = { buy: "Buy", sell: "Sell"};

const NOT_AVALIABLE_NUM_CONSTANT = -1;

const SECONDS_TILL_POLL_SERVER = 1.25;


export function StockTransaction({
    transactionMode, 
    userId, 
    tickerSymbol,
    displayComponentFunc
  }) {
  const [valueOfStock, updateStockValue] = useState(NOT_AVALIABLE_NUM_CONSTANT);
  const [amountOfStockOwned, updateAmountOfStockOwned] = useState(NOT_AVALIABLE_NUM_CONSTANT);
  const [moneyDeltaValue, updateMoneyDelta] = useState(NOT_AVALIABLE_NUM_CONSTANT);
  
  const [pollTick, pollTickUpdater] = useState(false);
  
  const [quanityOfStocks, changeQuanityOfStocks] = useState(1);
  
  const headerText = transactionMode;
  const valueOfStockStr = `$${valueOfStock.toFixed(2)}`;
  
  const amountofStockPrompStr = 
    `Quantity of stock to ${transactionMode.toLowerCase()}`;
  const quantityOfStockInput = useRef(null);
  function onQuanityOfStocksChange() {
    changeQuanityOfStocks(quantityOfStockInput.value);
  }

  const moneyDeltaStr = `Money ${transactionMode === "Buy"? "Lost": "Gained"}`;
  const moneyDeltaValueStr = 
    `${transactionMode === "Buy"? "-": "+"} $${valueOfStock.toFixed(2)}`;
  
  const confirmText = `Confirm ${transactionMode}`;
  
  function componentTick() {
    pollTickUpdater((prevValue) => {return !prevValue});
  }
  
  // Run on mount
  useEffect(() => {}, []);
  
  // Refreshing Stock Price
  useEffect(() => {
    socket.emit("pollStock", {"ticker_symbol" : tickerSymbol} , (response) => {
      updateStockValue(response[tickerSymbol]);
    });
    
    const timeoutReference = setTimeout(componentTick, SECONDS_TILL_POLL_SERVER * 1000);
    
    // Clean up function
    return () => {
      clearTimeout(timeoutReference);
    }
  }, [pollTick])
  
  
  return (
    <div class="stockTransactionComponent">
      <div class="stockTransactionInnerDiv">
        <div class="headerText"> {headerText} </div>
        <table class="stockTransactionTable">
          <tr class="tickerInfo">
            <td class="leftAlign"> {tickerSymbol} </td>
            <td class="rightAlign"> {valueOfStockStr} </td>
          </tr>
          <tr class="currentlyOwned">
            <td class="leftAlign"> Currently Owned </td>
            <td class="rightAlign"> {amountOfStockOwned} </td>
          </tr>
          <tr class="amountOfStocks">
            <td class="leftAlign"> {amountofStockPrompStr} </td>
            <td class="rightAlign"> 
              <input
                ref={quantityOfStockInput}
                type="number"
                oninput={onQuanityOfStocksChange}/> 
            </td>
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
  transactionMode: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  tickerSymbol: PropTypes.string.isRequired,
  displayComponentFunc: PropTypes.func.isRequired
};