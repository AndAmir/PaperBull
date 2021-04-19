import React from 'react';
import { GoogleLogin } from 'react-google-login';
import { socket } from './App';// eslint-disable-line

const { NODE_ENV } = process.env;
const clientID = NODE_ENV === 'production' ? window.API_URL : process.env.REACT_APP_GOOGLE_CLIENT;

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
        cookiePolicy="single_host_origin"
        style={{ marginTop: '100px' }}
        isSignedIn
      />

    </div>
  );
}

export default Login;
