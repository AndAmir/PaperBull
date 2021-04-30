import React from 'react';
import PropTypes from 'prop-types';
import { GoogleLogin } from 'react-google-login';
import { socket } from './App';// eslint-disable-line

const { NODE_ENV } = process.env;
const clientID = NODE_ENV === 'production' ? window.API_URL : process.env.REACT_APP_GOOGLE_CLIENT;

export function Login({ updateUser, updateName, setImageURL }) {
  const onSuccess = (res) => {
    console.log('[Google Client Login] currentUser:', res.profileObj);
    const userEmail = res.profileObj.email;
    const nameOfUser = res.profileObj.name;
    const profileImage = res.profileObj.imageUrl;
    socket.emit('login',
      { currentUser: userEmail, userRealName: nameOfUser, userImageUrl: profileImage},
      (response) => {
        if ('error' in response) {
          console.log(`Error with Google Login(${response.error})`);
          return;
        }
        updateUser(response.user);
        updateName(response.name);
        setImageURL(response.image);
      });
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

Login.propTypes = {
  updateUser: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
  setImageURL: PropTypes.func.isRequired,
};
