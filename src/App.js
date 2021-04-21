import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import { Login } from './Login'; // eslint-disable-line
import { Logout } from './Logout'; // eslint-disable-line
import { StockSearch } from './StockSearch'; // eslint-disable-line

export const socket = io();

function App() {
  const [thisUser, updateUser] = useState(''); // thisUser variable contains user email
  const [fullName, updateName] = useState(''); // fullName variable contains user's first and last name
  const [inSearchScreen, setInSearchScreen] = useState(false);

  useEffect(() => {
    socket.on('login', (data) => {
      console.log('login registered');
      console.log(data.added);
      console.log(data.name);
      updateUser(data.user);
      updateName(data.name);
    });
  }, []);

  useEffect(() => {
    socket.on('logout', (data) => {
      console.log('logout success');
      console.log(data.added);
      console.log(data.name);
      updateUser(data.user);
      updateName(data.name);
    });
  }, []);

  const hellotext = 'Hello ';

  if (thisUser === '') {
    return (
      <div className="wrapper-input">
        <div>
          <h1>Welcome to Paperbull</h1>
          <h3>Sign in with google</h3>
          <Login />
        </div>
      </div>
    );
  }
  if (inSearchScreen) {
    return <StockSearch userID={thisUser} />;
  }
  return (
    <div className="wrapper">
      <div>

        <h1>
          {hellotext}
          {fullName}
        </h1>
        <h3>Let&#39;s start investing</h3>
      </div>
      <div
        onClick={() => {
          setInSearchScreen(true);
        }}
        onKeyPress={(e) => e.key === 'Enter' && setInSearchScreen(true)}
        id="search_button"
        role="button"
        tabIndex={0}
      >
        <h1>BUY/SELL A STOCK!</h1>
      </div>
      <div style={{ paddingTop: 10 }}>

        <Logout />
      </div>
    </div>
  );
}

export default App;
