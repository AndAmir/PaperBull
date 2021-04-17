import React, { useState, useRef } from 'react';
import './App.css';
import io from 'socket.io-client';

export const socket = io();

function App() {
  const [thisUser, updateUser] = useState('');
  const inputUser = useRef('');
  
  function onButtonClick() {
    if(inputUser.current.value !== '') {
      const user = inputUser.current.value;
      updateUser( user )
    }
  }
  
  function logout() {
    if(thisUser !== '') {
      updateUser('');
    }
  }
  
    if(thisUser === '') {
      
      
      return (
        <div>
          <input type="text" ref={inputUser} placeholder="username" required />
          <button type="button" onClick={onButtonClick}>Log In</button>
        </div>
      );
      
      
    }
    else{
      return (
        <>
        <h1>Username: {thisUser}</h1>
        <button onClick = {logout}> Log Out </button>
        </>
        )
    }
    
    

}

export default App;
