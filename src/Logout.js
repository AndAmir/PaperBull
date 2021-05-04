import React from 'react';
import PropTypes from 'prop-types';
import { GoogleLogout } from 'react-google-login';
import { socket } from './App'; // eslint-disable-line

const { NODE_ENV } = process.env;
const clientID = process.env.REACT_APP_GOOGLE_CLIENT;

export function Logout({ updateUser, updateName }) {
  const onSuccess = () => {
    socket.emit('logout',
      { currentUser: '', userRealName: '' },
      (response) => {
        if ('error' in response) {
          console.log(`Logout Error(${response.error})`);
          return;
        }
        updateUser(response.user);
        updateName(response.name);
      });
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
Logout.propTypes = {
  updateUser: PropTypes.func.isRequired,
  updateName: PropTypes.func.isRequired,
};
