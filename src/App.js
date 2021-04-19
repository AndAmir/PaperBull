import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import { Login } from './Login'; // eslint-disable-line
import { Logout } from './Logout'; // eslint-disable-line
// Disabled lienes because of a dependendency cycle; however, the login and logout components are
// needed

export const socket = io();

function App() {
  const [thisUser, updateUser] = useState(''); // thisUser variable contains user email
  const [fullName, updateName] = useState(''); // fullName variable contains user's first and last name

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

  return (
    <div className="wrapper">
      <div>

        <h1>
          {hellotext}
          {fullName}
        </h1>
        <h3>Let&#39;s start investing</h3>
      </div>
      <div style={{ paddingTop: 10 }}>

        <Logout />
      </div>
    </div>
  );
}

export default App;
