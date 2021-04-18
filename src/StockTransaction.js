import React, { useRef, useState, useEffect } from "react";
import "./StockTransaction.css";
import PropTypes from "prop-types";

import { socket } from "./App.js";

export const STOCK_TRANSACTION_MODES = { buy: "Buy", sell: "Sell"};

const NOT_AVALIABLE_NUM_CONSTANT = -1;

const SECONDS_TILL_POLL_SERVER = 8;


export function StockTransaction({
    transactionMode, 
    userId, 
    tickerSymbol,
    displayComponentFunc
  }) {
  const [valueOfStock, updateStockValue] = useState(NOT_AVALIABLE_NUM_CONSTANT);
  const [amountOfStockOwned, updateAmountOfStockOwned] = useState(NOT_AVALIABLE_NUM_CONSTANT);
  
  // TODO: Implement this
  const [maxStockInTransaction, changeMax] = useState(1000);
  
  const [pollTick, pollTickUpdater] = useState(false);
  
  const [quantityOfStocks, changeQuanityOfStocks] = useState(0);
  
  const [processingTransaction, changeProcessingTransaction] = useState(false);
  
  const shouldComponentBeInteractable = 
    valueOfStock !== NOT_AVALIABLE_NUM_CONSTANT &&
    amountOfStockOwned !== NOT_AVALIABLE_NUM_CONSTANT &&
    !processingTransaction;
  
  // Header
  const headerText = transactionMode;
  
  // Stock Value
  const valueOfStockStr = `$${valueOfStock.toFixed(2)}`;
  
  // Stock Quantity Selection
  const amountofStockPrompStr = 
    `Quantity of stock to ${transactionMode.toLowerCase()}`;
  const quantityOfStockInput = useRef(null);
  
  function onQuanityOfStocksChange() {
    const valueInInputField = quantityOfStockInput.current.value;
    let validatedValue = parseInt(valueInInputField);
    if (isNaN(validatedValue)) {
      validatedValue = 0;
    }
    else if (valueInInputField < 0) {
      validatedValue = 1;
      quantityOfStockInput.current.value = validatedValue;
    } else if (valueInInputField > maxStockInTransaction) {
      validatedValue = maxStockInTransaction;
      quantityOfStockInput.current.value = validatedValue;
    }
    quantityOfStockInput.current.value = validatedValue;
    changeQuanityOfStocks(validatedValue);
  }

  // Money Delta
  const moneyDeltaStr = `Money ${transactionMode === "Buy"? "Lost": "Gained"}`;
  const moneyDeltaValueStr = 
    `${transactionMode === "Buy"? "-": "+"} $${
        (valueOfStock * quantityOfStocks).toFixed(2)
    }`;
  
  
  // Confirm Button
  const confirmText = `Confirm ${transactionMode}`;
  function attemptTransaction() {
    changeProcessingTransaction(true);
    socket.emit("processTransaction", 
    {"ticker_symbol" : tickerSymbol, "user_id" : userId, "quantity" : quantityOfStocks, "transaction_mode" : transactionMode}, 
    (response) => {
      changeProcessingTransaction(false);
      if ("error" in response) {
        console.log(`Transaction Failed. Error(${response.error})`);
        return;
      }
      
      updateQuantityOwned();
      for (const [key, value] of Object.entries(response)) {
        console.log(key, value);
      }
    });
  }
  
  function componentTick() {
    pollTickUpdater((prevValue) => {return !prevValue});
  }
  
  function updateQuantityOwned() {
    socket.emit("requestUserStockInfo", 
    {"ticker_symbol" : tickerSymbol, "user_id" : userId}, 
    (response) => {
      updateAmountOfStockOwned(response.quantity);
    });
  }
  
  // Run on mount
  useEffect(() => {
    updateQuantityOwned()
  }, []);
  
  // Refreshing Stock Price (Run on mount too)
  useEffect(() => {
    socket.emit("pollStock", {"ticker_symbol" : tickerSymbol} , (response) => {
      if (!("error" in response)) {
        updateStockValue(response[tickerSymbol]);
      } else {
        console.log(`Couldn't get Stock Data From Server. Error(${response.error})`)
      }
    });
    
    // After we centralize API Usage this is not needed
    const temporaryRandomOffset = (Math.random() * 10 - 5);
    
    const timeoutReference = 
      setTimeout(componentTick, (SECONDS_TILL_POLL_SERVER + temporaryRandomOffset) * 1000);
    
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
                disabled={!shouldComponentBeInteractable}
                type="number"
                placeholder="0"
                min="0"
                max={maxStockInTransaction}
                step="1"
                onInput={onQuanityOfStocksChange}/> 
            </td>
          </tr>
          <tr class="moneyDelta">
            <td class="leftAlign"> {moneyDeltaStr} </td>
            <td class="rightAlign"> {moneyDeltaValueStr} </td>
          </tr>
        </table>
        {
        shouldComponentBeInteractable &&
        quantityOfStocks > 0 &&
        <div 
          class="confirmButton"
          onClick={attemptTransaction}
          > 
          {confirmText}
        </div>
        }
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