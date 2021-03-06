import React, { useRef, useState, useEffect } from 'react';
import './StockTransaction.css';
import PropTypes from 'prop-types';
import { STOCK_TRANSACTION_MODES } from './StockSearch';
import { socket } from './App'; // eslint-disable-line

const NOT_AVALIABLE_NUM_CONSTANT = -1;

const SECONDS_TILL_POLL_SERVER = 8;

export function StockTransaction({
  transactionMode,
  userId,
  tickerSymbol,
  transactionModeFunc,
}) {
  const [valueOfStock, updateStockValue] = useState(NOT_AVALIABLE_NUM_CONSTANT);
  const [amountOfStockOwned, updateAmountOfStockOwned] = useState(
    NOT_AVALIABLE_NUM_CONSTANT,
  );
  const [avgPriceForOwnedStocks, updateAvgPriceForOwnedStocks] = useState(
    NOT_AVALIABLE_NUM_CONSTANT,
  );

  // TODO: Implement this
  const [maxStockInTransaction, changeMax] = useState(0);

  const [userBalance, changeBalance] = useState(0);

  const [pollTick, pollTickUpdater] = useState(false);

  const [quantityOfStocks, changeQuanityOfStocks] = useState(0);

  const [processingTransaction, changeProcessingTransaction] = useState(false);

  const shouldComponentBeInteractable = valueOfStock !== NOT_AVALIABLE_NUM_CONSTANT
    && amountOfStockOwned !== NOT_AVALIABLE_NUM_CONSTANT
    && !processingTransaction;

  // Header
  const headerText = transactionMode;

  // Close Button
  function requestComponentClose() {
    transactionModeFunc(STOCK_TRANSACTION_MODES.viewingOnly);
  }

  // Stock Value
  const valueOfStockStr = valueOfStock === NOT_AVALIABLE_NUM_CONSTANT
    ? '...'
    : `$${valueOfStock.toFixed(2)}`;

  // Stock Quantity Owned
  const amountOfStockOwnedStr = amountOfStockOwned === NOT_AVALIABLE_NUM_CONSTANT
    ? '...'
    : `${amountOfStockOwned}`;
  const averageValueOfOwnedStocked = `${
    avgPriceForOwnedStocks !== NOT_AVALIABLE_NUM_CONSTANT
      ? `Average Value: $${avgPriceForOwnedStocks.toFixed(2)}`
      : ''
  }`;

  // Stock Quantity Selection
  const amountofStockPrompStr = `Quantity of stock to ${transactionMode.toLowerCase()} (Current Balance: $${userBalance.toFixed(2)})`;

  const quantityOfStockInput = useRef(null);

  function onQuanityOfStocksChange() {
    const valueInInputField = quantityOfStockInput.current.value;
    let validatedValue = parseInt(valueInInputField, 10); // added ',10' for linting
    if (Number.isNaN(validatedValue)) {
      // added 'Number.'
      validatedValue = 0;
    } else if (valueInInputField < 0) {
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
  const moneyDeltaStr = `Money ${
    transactionMode === 'Buy' ? 'Lost' : 'Gained'
  }`;

  const moneyDeltaValueStr = quantityOfStocks < 1
    ? `$${(0.0).toFixed(2)}`
    : `${transactionMode === 'Buy' ? '-' : '+'} $${(
      valueOfStock * quantityOfStocks
    ).toFixed(2)}`;

  // Confirm Button
  const confirmText = processingTransaction
    ? 'Processing...'
    : `Confirm ${transactionMode}`;
  function updateQuantityOwned() {
    socket.emit(
      'requestUserStockInfo',
      {
        ticker_symbol: tickerSymbol,
        user_id: userId,
        transaction_mode: transactionMode,
      },
      (response) => {
        updateAmountOfStockOwned(response.quantity);
        if ('avg_price' in response) {
          updateAvgPriceForOwnedStocks(response.avg_price);
        } else {
          updateAvgPriceForOwnedStocks(NOT_AVALIABLE_NUM_CONSTANT);
        }
      },
    );
  }

  function attemptTransaction() {
    if (!shouldComponentBeInteractable) {
      return;
    }
    changeProcessingTransaction(true);
    socket.emit(
      'processTransaction',
      {
        ticker_symbol: tickerSymbol.trim().toUpperCase(),
        user_id: userId,
        quantity: quantityOfStocks,
        transaction_mode: transactionMode,
      },
      (response) => {
        changeProcessingTransaction(false);
        if ('error' in response) {
          const errorMsg = `Transaction Failed. Error(${response.error})`;
          console.log(errorMsg);
          alert(errorMsg);
          return;
        }

        const displayMessage = 'Transaction Successful\n'
        + `New Balance: $${response.newBalance.toFixed(2)}\n`
        + `New Stock Amount: ${response.newStockAmount}`;
        alert(displayMessage);
        quantityOfStockInput.current.value = 0;
        updateQuantityOwned();

        // for (const [key, value] of Object.entries(response)) {
        //   console.log(key, value);
        // }
      },
    );
  }

  function componentTick() {
    pollTickUpdater((prevValue) => !prevValue);
  }

  // Run on mount
  useEffect(() => {
    updateQuantityOwned();
  }, []);

  // Refreshing Stock Price (Run on mount too)
  useEffect(() => {
    socket.emit(
      'pollStock',
      {
        ticker_symbol: tickerSymbol,
        user_id: userId,
        transaction_mode: transactionMode,
      },
      (response) => {
        if ('error' in response) {
          updateStockValue(NOT_AVALIABLE_NUM_CONSTANT);
          changeMax(0);
          const errorMsg = `Couldn't get Stock Data From Server. Error(${response.error})`;
          console.log(errorMsg);
          alert(errorMsg);
          requestComponentClose();
          return;
        }

        updateStockValue(response[tickerSymbol]);
        changeMax(response.suggestive_max);
        changeBalance(response.remaining_balance);
      },
    );

    // After we centralize API Usage this is not needed
    const temporaryRandomOffset = Math.random() * 10 - 5;

    const timeoutReference = setTimeout(
      componentTick,
      (SECONDS_TILL_POLL_SERVER + temporaryRandomOffset) * 1000,
    );

    // Clean up function
    return () => {
      clearTimeout(timeoutReference);
    };
  }, [pollTick]);

  return (
    <div className="stockTransactionComponent">
      <div
        className="closeButton"
        onClick={requestComponentClose}
        onKeyPress={(e) => e.key === 'Enter' && requestComponentClose}
        role="button"
        tabIndex={0}
      >
        {' '}
        X
        {' '}
      </div>
      <div className="stockTransactionInnerDiv">
        <div className="headerText">
          {' '}
          {headerText}
          {' '}
        </div>
        <table className="stockTransactionTable">
          <tr className="tickerInfo">
            <td className="leftAlign">
              {' '}
              {tickerSymbol}
              {' '}
            </td>
            <td className="rightAlign">
              {' '}
              {valueOfStockStr}
              {' '}
            </td>
          </tr>
          <tr className="currentlyOwned">
            <td className="leftAlign"> Currently Owned </td>
            <td className="rightAlign">
              {amountOfStockOwnedStr}
              <br />
              {averageValueOfOwnedStocked}
            </td>
          </tr>
          <tr className="amountOfStocks">
            <td className="leftAlign">
              {' '}
              {amountofStockPrompStr}
              {' '}
            </td>
            <td className="rightAlign">
              <input
                className="inputBox"
                ref={quantityOfStockInput}
                disabled={!shouldComponentBeInteractable}
                type="number"
                placeholder="0"
                min="0"
                max={maxStockInTransaction}
                step="1"
                onInput={onQuanityOfStocksChange}
              />
            </td>
          </tr>
          <tr className="moneyDelta">
            <td className="leftAlign">
              {' '}
              {moneyDeltaStr}
              {' '}
            </td>
            <td className="rightAlign">
              {' '}
              {moneyDeltaValueStr}
              {' '}
            </td>
          </tr>
        </table>
        {quantityOfStocks > 0 && (
          <div
            className="confirmButton"
            onClick={attemptTransaction}
            onKeyPress={(e) => e.key === 'Enter' && attemptTransaction}
            role="button"
            tabIndex={0}
          >
            {confirmText}
          </div>
        )}
      </div>
    </div>
  );
}

export default StockTransaction;

StockTransaction.propTypes = {
  transactionMode: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  tickerSymbol: PropTypes.string.isRequired,
  transactionModeFunc: PropTypes.func.isRequired,
};
