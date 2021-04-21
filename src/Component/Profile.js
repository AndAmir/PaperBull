import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import './Profile.css';
import { UserProfile } from '.';
import { StockSearch } from '../StockSearch';

const socket = io();

function Profile({ userName }) {
  const [showStockSearch, setShowStockSearch] = useState(false);
  const [refreshData, resetRefreshData] = useState(false);
  const UPDATE_TABLE = 20;
  const [userPortfolio, setUserPortfolio] = useState({});
  const [userCashBalance, setUserCashBalance] = useState(0);
  const [userID, setUserID] = useState(0);

  function goToInvestingPage() {
    if (showStockSearch) {
      setShowStockSearch(false);
    } else {
      setShowStockSearch(true);
    }
  }

  function getPercentChange(averagePrice, currentPrice) {
    let percentChange = ((currentPrice - averagePrice) / averagePrice) * 100;
    percentChange = percentChange.toFixed(2);
    return percentChange;
  }

  function countTotalAssetsOwned() {
    let totalAssetsOwned = 0;
    // for (const [key] of Object.entries(userPortfolio)) {
    //   totalAssetsOwned += (userPortfolio[key].quantity * userPortfolio[key].currentPrice);
    // }
    Object.keys(userPortfolio).forEach((key) => { totalAssetsOwned += (userPortfolio[key].quantity * userPortfolio[key].currentPrice); });

    totalAssetsOwned = totalAssetsOwned.toFixed(2);
    return totalAssetsOwned;
  }

  function resetRefresh() {
    resetRefreshData(!refreshData);
  }

  function updatePortfolioandCashBalance() {
    socket.emit('updatePortfolio', { userName }, (response) => {
      if (!('error' in response)) {
        console.log(response);
        setUserPortfolio(response);
      } else {
        console.error("Couldn't get data from server", response.error);
      }
    });

    socket.emit('updateCashBalance', { userName }, (response) => {
      if (!(response.error)) {
        setUserCashBalance(response.cashBalance);
        setUserID(response.userId);
      } else {
        console.error("Couldn't get data from server", response.error);
      }
    });

    const timeoutReference = setTimeout(resetRefresh, (UPDATE_TABLE * 1000));

    // clean up
    return () => {
      clearTimeout(timeoutReference);
    };
  }

  useEffect(() => {
    updatePortfolioandCashBalance();
  }, [refreshData]);

  return (
    <div className="Profile">
      <div>
        <UserProfile userName={userName} totalAssetsOwned={countTotalAssetsOwned()} cashBal={userCashBalance} />
      </div>
      <div className="profile">
        {(showStockSearch) ? (
          <div>
            <StockSearch
              displayComponentFunc={setShowStockSearch}
              userID={userID}
            />
          </div>
        ) : (
          <div>
            <div className="userPortfolio">
              <table>
                <thead>
                  <tr>
                    <th colSpan="3">
                      {' '}
                      {userName}
                      &apos; Investments
                      {' '}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Stock </td>
                    <td> Quantity </td>
                    <td> Average Price </td>
                    <td> Current Value </td>
                    <td> Total Value </td>
                    <td> Percent Change </td>

                  </tr>
                  {Object.keys(userPortfolio).map((key) => (
                    <tr>
                      <td>
                        {' '}
                        {key}
                        {' '}
                      </td>
                      <td>
                        {' '}
                        {userPortfolio[key].quantity}
                      </td>
                      <td>
                        {' '}
                        {userPortfolio[key].averagePrice}
                      </td>
                      <td>
                        {' '}
                        {userPortfolio[key].currentPrice}
                        {' '}
                      </td>
                      <td>
                        {' '}
                        {(userPortfolio[key].quantity * userPortfolio[key].currentPrice).toFixed(2)}
                      </td>
                      <td>
                        {' '}
                        {getPercentChange(userPortfolio[key].averagePrice, userPortfolio[key].currentPrice)}
                        {' '}
                        %
                        {' '}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="startInvesting">
        <button className="startInvestingButton" type="submit" onClick={goToInvestingPage}> Let&apos;s Start Investing </button>
      </div>
    </div>
  );
}
Profile.propTypes = {
  userName: PropTypes.string.isRequired,
};

export default Profile;
