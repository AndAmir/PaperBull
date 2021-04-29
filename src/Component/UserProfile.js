import React from 'react';
import PropTypes from 'prop-types';
import './UserProfile.css';
import { Logout } from '../Logout'; // eslint-disable-line
function UserProfile({ userName, totalAssetsOwned, cashBal }) {
  const DEFUALT_STARTING_AMOUNT = 10000;

  function getPercentChange() {
    let percentChange = (((parseInt(cashBal, 10) + parseInt(totalAssetsOwned, 10)) - DEFUALT_STARTING_AMOUNT) / DEFUALT_STARTING_AMOUNT) * 100;
    percentChange = percentChange.toFixed(2);
    return percentChange;
  }

  function getTotalAssets() {
    const amountChange = parseInt(cashBal, 10) + parseInt(totalAssetsOwned, 10);
    return amountChange.toFixed(2);
  }
  return (
    <div className="userProfileHeader">
      <div className="profileImage">
        <img src="https://bit.ly/3tzk13c" alt="" />
      </div>
      <div className="profileName">
        <p>{userName}</p>

      </div>
      <div className="userBalance">
        <h4>
          {' '}
          Total Assets: $
          {getTotalAssets()}
          {' '}
          (
          {getPercentChange()}
          %)
          {' '}
        </h4>
        <h4>
          {' '}
          Cash Balance: $
          {cashBal.toFixed(2)}
        </h4>
      </div>
    </div>
  );
}

export default UserProfile;
UserProfile.propTypes = {
  userName: PropTypes.string.isRequired,
  totalAssetsOwned: PropTypes.number.isRequired,
  cashBal: PropTypes.number.isRequired,
};
