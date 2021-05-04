import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import './Profile.css';
import { UserProfile } from '.';
import { StockSearch } from '../StockSearch';

const socket = io();

function Profile({ userName, userEmail, userImage }) {
  const [showStockSearch, setShowStockSearch] = useState(false);
  const [refreshData, resetRefreshData] = useState(false);
  const UPDATE_TABLE = 60;
  const [userPortfolio, setUserPortfolio] = useState({});
  const [userCashBalance, setUserCashBalance] = useState(0);
  const [userID, setUserID] = useState(0);
  const [showLeaderBoard, setShowLeaderBoard] = useState(false);
  const [gameLeaderBoard, setLeaderBoard] = useState([]);
  const [showProfileTable, setshowProfileTable] = useState(false);
  const [sortType, setSortType] = useState('asc');

  function goToInvestingPage() {
    if (showStockSearch) {
      setShowStockSearch(false);
    } else {
      setShowStockSearch(true);
    }
  }

  function sortTable() {
    if (sortType === 'asc') {
      const leaderBoard = [...gameLeaderBoard];
      leaderBoard.sort((a, b) => ((a.userCashBalance > b.userCashBalance) ? 1 : -1));
      setLeaderBoard(leaderBoard);
      setSortType('des');
    } else {
      const leaderBoard = [...gameLeaderBoard];
      leaderBoard.sort((a, b) => ((a.userCashBalance < b.userCashBalance) ? 1 : -1));
      setLeaderBoard(leaderBoard);
      setSortType('asc');
    }
  }

  function getPercentChange(averagePrice, currentPrice) {
    let percentChange = ((currentPrice - averagePrice) / averagePrice) * 100;
    percentChange = percentChange.toFixed(2);
    return percentChange;
  }

  function countTotalAssetsOwned() {
    let totalAssetsOwned = 0;
    Object.keys(userPortfolio).forEach((key) => {
      totalAssetsOwned += (userPortfolio[key].quantity * userPortfolio[key].currentPrice);
    });

    totalAssetsOwned = totalAssetsOwned.toFixed(2);
    return totalAssetsOwned;
  }

  function resetRefresh() {
    resetRefreshData(!refreshData);
  }

  function updatePortfolioandCashBalance() {
    socket.emit('updatePortfolio', { userEmail }, (response) => {
      if (!('error' in response)) {
        setUserPortfolio(response);
        setshowProfileTable(true);
      }
    });

    socket.emit('updateCashBalance', { userEmail }, (response) => {
      if (!(response.error)) {
        setUserCashBalance(response.cashBalance);
        setUserID(response.userId);
      }
    });

    socket.emit('updateLeaderBoard', { UPDATE_TABLE }, (response) => {
      if (!('error' in response)) {
        setLeaderBoard(response);
        setShowLeaderBoard(true);
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
  if (showStockSearch) {
    return (
      <>
        <div>
          <StockSearch
            displayComponentFunc={setShowStockSearch}
            userID={userID}
          />
          <button className="startInvestingButton" type="submit" onClick={goToInvestingPage}>
            <h3>Back to Home</h3>
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="userProfile">
      <div>
        <UserProfile userImage={userImage} userName={userName} totalAssetsOwned={countTotalAssetsOwned()} cashBal={userCashBalance} />
      </div>
      <div>
        <div className="container">
          <div className="tablePortfolio">
            { showProfileTable ? (
              <table>
                <thead>
                  <tr>
                    <th colSpan="6" className="header">
                      {userName}
                      &apos; Investments
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Stock </td>
                    <td> Qnty. </td>
                    <td> Avg. </td>
                    <td> Crnt. </td>
                    <td> Total $</td>
                    <td> Change</td>
                  </tr>
                  {Object.keys(userPortfolio).map((key) => (
                    <tr>
                      <td>
                        {key}
                      </td>
                      <td>
                        {userPortfolio[key].quantity}
                      </td>
                      <td>
                        {userPortfolio[key].averagePrice.toFixed(2)}
                      </td>
                      <td>
                        {userPortfolio[key].currentPrice.toFixed(2)}
                      </td>
                      <td>
                        {(userPortfolio[key].quantity * userPortfolio[key].currentPrice).toFixed(2)}
                      </td>
                      <td>
                        {getPercentChange(userPortfolio[key].averagePrice, userPortfolio[key].currentPrice)}
                        %
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (null) }
          </div>
          <div className="tableLeaderBoard">
            {(showLeaderBoard) ? (
              <table>
                <thead>
                  <tr>
                    <th onClick={sortTable} colSpan="2" className="header">
                      LeaderBoard (Press to Sort)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td> Name </td>
                    <td> Total $ </td>
                  </tr>
                  {gameLeaderBoard.map((item) => (
                    <tr>
                      <td>
                        {item.userName}
                      </td>
                      <td>
                        {item.userCashBalance.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (null)}
          </div>
        </div>
      </div>
      <div className="startInvesting">
        <button className="startInvestingButton" type="submit" onClick={goToInvestingPage}>
          <h3>Let&apos;s Start Investing</h3>
        </button>
      </div>
    </div>
  );
}
Profile.propTypes = {
  userName: PropTypes.string.isRequired,
  userImage: PropTypes.string.isRequired,
  userEmail: PropTypes.string.isRequired,
};

export default Profile;
