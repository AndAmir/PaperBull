import React from 'react';
import { GoogleLogin } from 'react-google-login';
import io from 'socket.io-client';
import { socket } from './App';


// Remove this later
// const clientID = '386644716433-1ee1beupucvfa35vf9ubp0q8uacsqttp.apps.googleusercontent.com';
const { REACT_APP_GIT_HASH, REACT_APP_MY_ENV, NODE_ENV } = process.env;
const clientID =
  NODE_ENV === 'production' ? window.API_URL : process.env.REACT_APP_GOOGLE_CLIENT;

export function Login() {

    
    const onSuccess = (res) => {
        console.log('[Login Success] currentUser:', res.profileObj);
        const userEmail = res.profileObj.email;
        const nameOfUser = res.profileObj.name;
        socket.emit('login', { currentUser: userEmail, userRealName: nameOfUser });
        
    };
    const onFailure = (res) => {
        console.log('[Login failed] res:', res);
    };
    
    return (
        <div>
            <GoogleLogin
                clientId={clientID}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                style={{ marginTop: '100px' }}
                isSignedIn={true}
            />
            
            
        </div>
    );

    
}

export default Login;