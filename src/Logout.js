import React from 'react';
import { GoogleLogout } from 'react-google-login';
import { socket } from './App'; // eslint-disable-line

const { NODE_ENV } = process.env;
const clientID = NODE_ENV === 'production' ? window.API_URL : process.env.REACT_APP_GOOGLE_CLIENT;

export function Logout() {
  const onSuccess = () => {
    alert('Logged out successfully');
    socket.emit('logout', { currentUser: '', userRealName: '' });
  };

  return (
    <div>
      <GoogleLogout
        clientId={clientID}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
}

export default Logout;
