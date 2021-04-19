import { useState } from 'react';
import './UserProfile.css';

function UserProfile({totalAssetsOwned, totalInvested}) {
    
    const DEFUALT_STARTING_AMOUNT = 10000;
    console.log(totalInvested);
    
    function getCashBalance(){
        let cashBal = totalAssetsOwned - totalInvested;
        cashBal = cashBal.toFixed(2);
        return cashBal;
    }
    
    function getPercentChange(){
        let percentChange = ((totalAssetsOwned - DEFUALT_STARTING_AMOUNT) / DEFUALT_STARTING_AMOUNT) * 100;
        percentChange = percentChange.toFixed(2);
        return percentChange;
    }
    return (
        <div className = "userProfileHeader">
            <div className = "profileImage">
                <img src="https://bit.ly/3tzk13c" alt=''/>
            </div>
            <div className="profileName">
                <p>Parth Patel</p>
            </div>
            <div className="userBalance">
                <h4> Total Assets: ${totalAssetsOwned} ({getPercentChange()}%) </h4>
                <h4> Cash Balance: ${getCashBalance()} </h4>
            </div>
        </div>
    );
    
}

export default UserProfile; 