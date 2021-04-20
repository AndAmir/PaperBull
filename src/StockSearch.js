import React, { useRef, useState } from 'react';
import { socket } from './App';
import { StockChart } from './StockChart';

export function StockSearch() {
  const [userInput, setUserInput] = useState('');
  const inputTicker = useRef();

  function search() {
    setUserInput(inputTicker);
    socket.emit('searchTicker', { ticker: inputTicker.current.value });// TODO MUST FIX GETTING INPUT
  }
  function transaction() {
    console.log('transaction');
  }

  return (
    <div>
      <input type="text" ref={inputTicker} placeholder="Enter Ticker Symbol..." onKeyPress={(e) => e.key === 'Enter' && search()} required />

      {/* <h1>{userInput}</h1> */}
      { userInput === '' ? (
        <h1>Enter a Ticker Symbol</h1>
      ) : (
        <div>
          <StockChart ticker={inputTicker} />
          <div
            onClick={() => {
              transaction();
            }}
            onKeyPress={(e) => e.key === 'Enter' && transaction()}
            id="buy"
            role="button"
            tabIndex={0}
          >
            <h1>BUY</h1>
          </div>
          <div
            onClick={() => {
              transaction();
            }}
            onKeyPress={(e) => e.key === 'Enter' && transaction()}
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
