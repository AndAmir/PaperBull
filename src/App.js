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
          <div>
            <div id="welcome"><h1>Welcome to Paperbull</h1></div>
            {/* <h3>Sign in with google</h3> */}
            <div id="login">
              <Login
                updateUser={updateUser}
                updateName={updateName}
                setImageURL={setImageURL}
              />
            </div>
          </div>
          <div className="containers">
            <h3>What is PaperBull?</h3>
            <p>PaperBull is a virtual trading app that allows users that have an interest in the stock market to learn and have fun competeing with friends to see who can improve their total assests the most</p>
          </div>
          <div className="containers">
            <h3>Lets Get Started!</h3>
            <p>PaperBull is very simple to use. Login with your google account. You will see your Portfolio, which shows information about your investments and a leaderboard of all Paperbull users. To buy or sell a stock, click the &quot;Let&apos;s Start Investing&quot; button. Enter the ticker symbol of a stock to few its 6 month price history, you can then buy or sell the stock. You start with $10,000 Have Fun Investing!</p>
          </div>
          <div className="containers">
            <h3>Our Inspiration</h3>
            <p>We were first inspired to create PaperBull with a recent rise in popularity of meme stocks. This prompted us to want to learn more about the stock market, and how popular free-trading apps like Robinhood work.</p>
          </div>
          <div className="containers">
            <h3>PaperBull Developers</h3>
            <a id="dev" href="https://github.com/perbhat">Perbhat Kumar</a>
            <a id="dev" href="https://github.com/pxrth9">Parth Patel</a>
            <a id="dev" href="https://github.com/GamingDoge69">John Santelises</a>
            <a id="dev" href="https://github.com/AndAmir">Andrew Amirov</a>
          </div>
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
