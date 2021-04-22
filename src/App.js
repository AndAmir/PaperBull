import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import { Login } from './Login'; // eslint-disable-line
import Profile from './Component/Profile';

export const socket = io();

function App() {
  const [thisUser, updateUser] = useState(''); // thisUser variable contains user email
  const [fullName, updateName] = useState(''); // fullName variable contains user's first and last name
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    socket.on('login', (data) => {
      console.log('login registered');
      console.log(data.added);
      console.log(data.name);
      console.log(data.image);
      updateUser(data.user);
      updateName(data.name);
      setImageURL(data.image);
    });
  }, []);

  useEffect(() => {
    socket.on('logout', (data) => {
      console.log('logout success');
      console.log(data.added);
      console.log(data.name);
      console.log(data.image);
      updateUser(data.user);
      updateName(data.name);
      setImageURL(data.image);
    });
  }, []);

  console.log(thisUser);

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
      <Profile userName={fullName} userEmail={thisUser} userImage={imageURL} />
    </div>
  );
}

export default App;
