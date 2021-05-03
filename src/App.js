import React, { useState } from 'react';
import './App.css';
import io from 'socket.io-client';
import { Login } from './Login'; // eslint-disable-line
import { Logout } from './Logout'; // eslint-disable-line
import Profile from './Component/Profile';

export const socket = io();

function App() {
  const [thisUser, updateUser] = useState(''); // thisUser variable contains user email
  const [fullName, updateName] = useState(''); // fullName variable contains user's first and last name
  const [imageURL, setImageURL] = useState('');
  if (thisUser === '') {
    return (
      <div className="wrapper-input">
        <div>
          <h1>Welcome to Paperbull</h1>
          <h3>Sign in with google</h3>
          <Login
            updateUser={updateUser}
            updateName={updateName}
            setImageURL={setImageURL}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="toolbar">
        <Logout
          updateUser={updateUser}
          updateName={updateName}
          setImageURL={setImageURL}
        />
      </div>
      <div className="wrapper">
        <Profile
          userName={fullName}
          userEmail={thisUser}
          userImage={imageURL}
        />
      </div>
    </div>

  );
}

export default App;
