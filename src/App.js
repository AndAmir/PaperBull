import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

export const socket = io();

function App() {
  const [thisUser, updateUser] = useState('');
  const inputUser = useRef('');

  function onButtonClick() {
    if (inputUser.current.value !== '') {
      const user = inputUser.current.value;
      updateUser(user);
      socket.emit('login', { currentUser: user });
      console.log('emitted');
    }
  }

  useEffect(() => {
    socket.on('login', (data) => {
      console.log('login registered');
      console.log(data.added);
    });
  }, []);

  function logout() {
    if (thisUser !== '') {
      updateUser('');
    }
  }

  const hellotext = 'Hello ';

  if (thisUser === '') {
    return (
      <div className="wrapper-input">
        <div>
          <input type="text" ref={inputUser} placeholder="username" required />
          <div style={{ paddingTop: 10 }}>
            <button type="button" onClick={onButtonClick}>
              <h3>Log In</h3>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div>
        <h1>
          {hellotext}
          {thisUser}
        </h1>
        <h3>Let&#39;s start investing</h3>
      </div>
      <div style={{ paddingTop: 10 }}>
        <button type="button" onClick={logout}><h3>Log Out </h3></button>
      </div>
    </div>
  );
}

export default App;
