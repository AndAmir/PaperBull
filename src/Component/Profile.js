import { useState } from 'react';
// import io from 'socket.io-client';
import './Profile.css';

// const socket = io();

function Portfolio(){
    
    const [userState, setUserState] = useState(false);
    const userName = "Parth";
    const userPortfolio = {
        'AAPL': {'stocksOwned': 50, 'averagePrice': 299.5},
        'TSLA' : {'stocksOwned': 20, 'averagePrice': 9.5},
        'GME'  : {'stocksOwned': 70, 'averagePrice': 89.5},
        'NIO'  : {'stocksOwned': 90, 'averagePrice': 59.5}
    };
    const cashBalance = 4500;
    const totalAssets = 9000;
    
    function goToInvestingPage(){
        if(userState){
            setUserState(false);
        }
        else{
            setUserState(true);
        }
    }

    return (
        <div>
            <div>
                {(userState) ? (<h1> Go to Portfolio Page </h1>) : (null) }
            </div>
            <div className="userBalance">
                <h4> Total Assets: {totalAssets} </h4>
                <h4> Cash Balance: {cashBalance} </h4>
            </div>
            <div className = "userPortfolio">
                <table>
                    <thead>
                        <tr>
                            <th colSpan="3"> {userName}'s Investments </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td> Stock </td>
                            <td> Quantity </td>
                            <td> Average Price </td>
                        </tr>
                        {Object.keys(userPortfolio).map((key) => (
                            <tr>
                                <td> {key} </td>
                                <td className="stockPrice"> {userPortfolio[key]['stocksOwned']}</td>
                                <td className="stockPrice"> {userPortfolio[key]['averagePrice']}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="startInvesting">
                <button className="startInvestingButton" type="submit" onClick={goToInvestingPage}> Let's Start Investing </button>
            </div>
        </div>
    );
}

export default Portfolio;