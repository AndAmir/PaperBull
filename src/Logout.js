import React from 'react';
import { GoogleLogout } from 'react-google-login';
import io from 'socket.io-client';
import { socket } from './App';


// Remove this later
const clientID = '386644716433-1ee1beupucvfa35vf9ubp0q8uacsqttp.apps.googleusercontent.com';


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