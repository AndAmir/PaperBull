import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import { Login } from './Login'; // eslint-disable-line
import Profile from './Component/Profile';

export const socket = io();

function App() {
  const [thisUser, updateUser] = useState(''); // thisUser variable contains user email
  const [fullName, updateName] = useState(''); // fullName variable contains user's first and last name
  useEffect(() => {
    socket.on('logout', (data) => {
      console.log('logout success');
      console.log(data.added);
      console.log(data.name);
      updateUser(data.user);
      updateName(data.name);
    });
  }, []);
  if (thisUser === '') {
    return (
      <div className="wrapper-input">
        <div>
          <h1>Welcome to Paperbull</h1>
          <h3>Sign in with google</h3>
          <Login
            updateUser={updateUser}
            updateName={updateName}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Profile
        userName={thisUser}
        fullName={fullName}
      />
    </div>
  );
}

export default App;
