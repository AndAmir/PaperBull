import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { socket } from './App';// eslint-disable-line
import { StockChart } from './StockChart';// eslint-disable-line
import { StockTransaction, STOCK_TRANSACTION_MODES } from './StockTransaction';// eslint-disable-line

export function StockSearch(props) {
  const { userID } = props;
  const [userInput, setUserInput] = useState('');
  const inputTicker = useRef();
  const [displayStockTransaction, setDisplayStockTransaction] = useState(false);
  const [isBuy, setIsBuy] = useState(false);
  const [isSell, setIsSell] = useState(false);

  function search() {
    setUserInput(inputTicker);
    socket.emit('searchTicker', { ticker: inputTicker.current.value }); // TODO MUST FIX GETTING INPUT
  }

  function transaction(type) {
    setDisplayStockTransaction(true);
    if (type === 'buy') {
      setIsBuy(true);
    } else if (type === 'sell') {
      setIsSell(true);
    }
    console.log('transaction', userID);
  }

  return (
    <div>
      <input
        type="text"
        ref={inputTicker}
        placeholder="Enter Ticker Symbol..."
        onKeyPress={(e) => e.key === 'Enter' && search()}
        required
      />

      {/* <h1>{userInput}</h1> */}
      {userInput === '' ? (
        <h1>Enter a Ticker Symbol</h1>
      ) : (
        <div>
          {displayStockTransaction ? (
            <div>
              {isBuy && (
              <>
                <h1>Buy</h1>
                <StockTransaction
                  transactionMode={STOCK_TRANSACTION_MODES.buy}
                  userId={userID}
                  tickerSymbol={inputTicker.current.value}
                  displayComponentFunc={setDisplayStockTransaction}
                />
              </>
              )}
              {isSell && (
              <>
                <h1>Sell</h1>
                <StockTransaction
                  transactionMode={STOCK_TRANSACTION_MODES.sell}
                  userId={userID}
                  tickerSymbol={inputTicker.current.value}
                  displayComponentFunc={setDisplayStockTransaction}
                />
              </>
              )}
            </div>
          ) : (
            <StockChart ticker={inputTicker} />
          )}

          <div
            onClick={() => {
              transaction('buy');
            }}
            onKeyPress={(e) => e.key === 'Enter' && transaction('buy')}
            id="buy"
            role="button"
            tabIndex={0}
          >
            <h1>BUY</h1>
          </div>
          <div
            onClick={() => {
              transaction('sell');
            }}
            onKeyPress={(e) => e.key === 'Enter' && transaction('sell')}
            id="sell"
            role="button"
            tabIndex={0}
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
  userID: PropTypes.string.isRequired,
};
