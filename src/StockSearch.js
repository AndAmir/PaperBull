import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { socket } from './App';// eslint-disable-line
import { StockChart } from './StockChart';// eslint-disable-line
import { StockTransaction} from './StockTransaction';// eslint-disable-line
import './StockSearch.css';

export const STOCK_TRANSACTION_MODES = {
  buy: 'Buy', sell: 'Sell', viewingOnly: 'ViewingOnly',
};

export function StockSearch(props) {
  const { userID } = props;
  const [userInput, setUserInput] = useState('');
  const inputTicker = useRef();
  const [transactionMode, setTransactionMode] = useState(STOCK_TRANSACTION_MODES.viewingOnly);

  function search() {
    setUserInput(inputTicker.current.value.trim().toUpperCase());
  }

  return (
    <div className="searchContainer">
      {userInput === '' ? (
        <div>
          <h1>Enter a Ticker Symbol</h1>
        </div>
      ) : (
        <div className="chart">
          <StockChart userInputtedticker={userInput} />
          {transactionMode !== STOCK_TRANSACTION_MODES.viewingOnly
              && (
              <div>
                <StockTransaction
                  transactionMode={transactionMode}
                  userId={userID}
                  tickerSymbol={inputTicker.current.value.trim().toUpperCase()}
                  transactionModeFunc={setTransactionMode}
                />
              </div>
              )}
        </div>
      )}
      <div className="">
        <input
          type="text"
          ref={inputTicker}
          placeholder="Enter Ticker Symbol..."
          onKeyPress={(e) => e.key === 'Enter' && search()}
          id="ticker_search"
          required
        />
      </div>
      {/* <h1>{userInput}</h1> */}
      {transactionMode === STOCK_TRANSACTION_MODES.viewingOnly
      && (
      <div className="container">
        <div
          onClick={() => {
            setTransactionMode(STOCK_TRANSACTION_MODES.buy);
          }}
          onKeyPress={(e) => e.key === 'Enter'
                && setTransactionMode(STOCK_TRANSACTION_MODES.buy)}
          id="buy"
          role="button"
          tabIndex={0}
          className="container"
        >
          <h1>BUY</h1>
        </div>
        <div
          onClick={() => {
            setTransactionMode(STOCK_TRANSACTION_MODES.sell);
          }}
          onKeyPress={(e) => e.key === 'Enter'
                && setTransactionMode(STOCK_TRANSACTION_MODES.sell)}
          id="sell"
          role="button"
          tabIndex={0}
          className="container"
        >
          <h1>SELL</h1>
        </div>
      </div>
      )}
    </div>
  );
}

export default StockSearch;

StockSearch.propTypes = {
  userID: PropTypes.number.isRequired,
};
