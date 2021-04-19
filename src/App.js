import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import { Login } from './Login'
import { Logout } from './Logout'

export const socket = io();

function App() {
  const [thisUser, updateUser] = useState('');
  const [fullName, updateName] = useState('');
  
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
      console.log(data.name);
      updateUser(data.user)
      updateName(data.name)
    });
  }, []);
  
    useEffect(() => {
    socket.on('logout', (data) => {
      console.log('logout success');
      console.log(data.added);
      console.log(data.name);
      updateUser(data.user)
      updateName(data.name)
    });
  }, []);


  function logout() {
    if (thisUser !== '') {
      updateUser('');
      updateName('');
    }
  }
  
  
//   const handleLogin = async googleData => {
//   const res = await fetch("/api/v1/auth/google", {
//       method: "POST",
//       body: JSON.stringify({
//       token: googleData.tokenId
//     }),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   })
//   const data = await res.json()
//   // store returned user somehow
// }
  
  
  

  const hellotext = 'Hello ';

  if (thisUser === '') {
    return (
      <div className="wrapper-input">
        <div>
          <h1>Welcome to Paperbull</h1>
          <h3>Sign in with google</h3>
          <Login/>
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

        <Logout/>
      </div>
    </div>
  );
}

export default App;
