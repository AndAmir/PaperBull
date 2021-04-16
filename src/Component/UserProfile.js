import { useState } from 'react';
import './UserProfile.css';

function UserProfile() {
    
    const cashBalance = 4500;
    const totalAssets = 9000;
    return (
        <div>
            <div className="userBalance">
                <h4> Total Assets: {totalAssets} </h4>
                <h4> Cash Balance: {cashBalance} </h4>
            </div>
        </div>
    );
    
}

export default UserProfile; 