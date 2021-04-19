import React from 'react';
import { GoogleLogout } from 'react-google-login';
import io from 'socket.io-client';
import { socket } from './App';


// Remove this later

const { REACT_APP_GIT_HASH, REACT_APP_MY_ENV, NODE_ENV } = process.env;
const clientID =
  NODE_ENV === 'production' ? window.API_URL : process.env.REACT_APP_GOOGLE_CLIENT;

export function Logout() {

    
    const onSuccess = (res) => {
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