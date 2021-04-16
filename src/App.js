<<<<<<< HEAD
// import logo from './logo.svg';
import './App.css';
import { Profile } from './';

function App() {
  return (
    <div className="App">
      <Profile />
=======
import './App.css';
import io from 'socket.io-client';

export const socket = io(); 

function App() {
  return (
    <div>
>>>>>>> 795075bf9ab8cf44ffee3b3d8b7c6f13e2c24c9e
    </div>
  );
}

// <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
export default App;
