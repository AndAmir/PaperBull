import { useState } from 'react';
import './UserProfile.css';

function UserProfile({userName, totalAssetsOwned, cashBal}) {
    
    const DEFUALT_STARTING_AMOUNT = 10000;
    
    function getPercentChange(){
        let percentChange = (((parseInt(cashBal) + parseInt(totalAssetsOwned)) - DEFUALT_STARTING_AMOUNT) / DEFUALT_STARTING_AMOUNT) * 100;
        percentChange = percentChange.toFixed(2);
        return percentChange;
    }
    
    function getTotalAssets(){
        let amountChange = parseInt(cashBal) + parseInt(totalAssetsOwned)
        return amountChange.toFixed(2)
    }
    return (
        <div className = "userProfileHeader">
            <div className = "profileImage">
                <img src="https://bit.ly/3tzk13c" alt=''/>
            </div>
            <div className="profileName">
                <p>{userName}</p>
            </div>
            <div className="userBalance">
                <h4> Total Assets: ${getTotalAssets()} ({getPercentChange()}%) </h4>
                <h4> Cash Balance: ${cashBal.toFixed(2)} </h4>
            </div>
        </div>
    );
    
}

export default UserProfile; 