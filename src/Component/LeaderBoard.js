import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './LeaderBoard.css';

const socket = io();

function LeaderBoard() {
  const [gameLeaderBoard, setLeaderBoard] = useState();
  const [refreshData, resetRefreshData] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const UPDATE_TABLE = 60;

  function sortTable(table) {
    console.log('here');
    if (table) {
      console.log('tru');
    } else {
      console.log('fal');
    }
  }

  function resetRefresh() {
    resetRefreshData(!refreshData);
  }

  function updateLeaderBoard() {
    socket.emit('updateLeaderBoard', { UPDATE_TABLE }, (response) => {
      if (!('error' in response)) {
        setLeaderBoard(response);
        if (gameLeaderBoard !== {}) {
          setShowTable(true);
        }
      } else {
        console.error("Couldn't get data from server", response.error);
      }
    });
    // console.log(gameLeaderBoard);
    const timeoutReference = setTimeout(resetRefresh, (UPDATE_TABLE * 1000));
    // clean up
    return () => {
      clearTimeout(timeoutReference);
    };
  }

  useEffect(() => {
    updateLeaderBoard();
  }, []);

  return (
    <div>
      <div>
        <button type="submit" onClick={sortTable(true)}> Sort </button>
      </div>
      <div>
        {(showTable) ? (
          <table className="sortable  table-sortable ">
            <thead>
              <tr>
                <th colSpan="2" className="header">
                  LeaderBoard
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> Name </td>
                <td> Total Assets </td>
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
  );
}

export default LeaderBoard;
