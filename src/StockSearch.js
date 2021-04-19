import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { socket, setInSearchScreen } from './App.js';
import { StockChart } from './StockChart';

export function StockSearch(props) {
  const [userInput, setUserInput] = useState('');
  const inputTicker = useRef();

  function search() {
    console.log('in Search', inputTicker);
    setUserInput(inputTicker);
    socket.emit('searchTicker', { ticker: inputTicker.current.value });// TODO MUST FIX GETTING INPUT
  }
  function transaction() {
    console.log('transaction');
  }

  return (
    <div>
      <input type="text" ref={inputTicker} placeholder="Enter Ticker Symbol..." onKeyPress={(e) => e.key === 'Enter' && search()} required />

      <div
        onClick={() => {
          search();
        }}
        id="search"
        role="button"
        tabIndex={0}
      >
        <h1>Search</h1>
      </div>
      {/* <h1>{userInput}</h1> */}
      { userInput == '' ? (
        <h1>Enter a Ticker Symbol</h1>
      ) : (
        <div>
          <StockChart ticker={inputTicker} />
          <div
            onClick={() => {
              transaction();
            }}
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
