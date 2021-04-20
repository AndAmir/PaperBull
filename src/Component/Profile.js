import { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import io from 'socket.io-client';
import './Profile.css';
import { UserProfile }  from './';

const socket = io();

function Portfolio({userName}){
    
    
    const [userState, setUserState] = useState(false);
    const [refreshData, resetRefreshData] = useState(false);
    const UPDATE_TABLE = 20;
    const [ userPortfolio, setUserPortfolio] = useState({});
    const [userCashBalance, setUserCashBalance] = useState(0);
    
    

    userName = "Test";
    // const userPortfolio = {
    //     'UBER': {'quantity': 10, 'averagePrice': 32.08, 'currentPrice' : 60},
    //     'GOOG' : {'quantity': 0.35, 'averagePrice': 1499.66, 'currentPrice' : 2297},
    //     'IVR'  : {'quantity': 400, 'averagePrice': 3.98, 'currentPrice' : 3.81},
    //     'NIO'  : {'quantity': 78.2, 'averagePrice': 6.69, 'currentPrice' : 35.54},
    //     'T'  : {'quantity': 50, 'averagePrice': 29.90, 'currentPrice' : 30.02},
    //     'TRTX'  : {'quantity': 270, 'averagePrice': 5.68, 'currentPrice' : 11.64},
    //     'RCL'  : {'quantity': 40, 'averagePrice': 31.41, 'currentPrice' : 85.30},
    //     'AAPL'  : {'quantity': 10, 'averagePrice': 96.66, 'currentPrice' : 134.46},
    // };
    
    function goToInvestingPage(){
        if(userState){
            setUserState(false);
        }
        else{
            setUserState(true);
        }
    }
    
    function getPercentChange(averagePrice, currentPrice){
        let percentChange = ((currentPrice - averagePrice) / averagePrice) * 100;
        percentChange = percentChange.toFixed(2);
        return percentChange;
    }
    
    function countTotalAssetsOwned(){
        let totalAssetsOwned = 0;
        Object.keys(userPortfolio).map((key)=> {
            totalAssetsOwned += (userPortfolio[key]['quantity'] * userPortfolio[key]['currentPrice']);
        });
        totalAssetsOwned = totalAssetsOwned.toFixed(2);
        return totalAssetsOwned;
    }
    
    function resetRefresh(){
        resetRefreshData(!refreshData);
    }
    
    function updatePortfolioandCashBalance(){
        socket.emit('updatePortfolio', {'userName' : userName}, (response) =>{
            if(!("error" in response)) {
                console.log(response);
                setUserPortfolio(response);
            }
            else{
                console.error("Couldn't get data from server", response.error);
            }
        });
        
        socket.emit('updateCashBalance', {'userName' : userName}, (response) =>{
           if(!(response.error)) {
               console.log(response);
               setUserCashBalance(response);
           } 
           else{
                console.error("Couldn't get data from server", response.error);
            }
        });
        
        const timeoutReference = setTimeout(resetRefresh, (UPDATE_TABLE * 1000));
        
        //clean up
        return() => {
            clearTimeout(timeoutReference);
        }
    }
    
    useEffect(() => {
        updatePortfolioandCashBalance();
    }, [refreshData]);
    
    return (
        <div className="Profile">
            <div>  
                <UserProfile userName={userName} totalAssetsOwned={countTotalAssetsOwned()} cashBal={userCashBalance} />
            </div>
            <div className = "profile">
            {(userState) ? (
                <h1> GO TO PORTFOLIO </h1>
            ) : (
                <div>
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
                                    <td> Current Value </td>
                                    <td> Total Value </td>
                                    <td> Percent Change </td>
                                    
                                </tr>
                                {Object.keys(userPortfolio).map((key) => (
                                    <tr>
                                        <td> {key} </td>
                                        <td> {userPortfolio[key]['quantity']}</td>
                                        <td> {userPortfolio[key]['averagePrice']}</td>
                                        <td> {userPortfolio[key]['currentPrice']} </td>
                                        <td> {(userPortfolio[key]['quantity'] * userPortfolio[key]['currentPrice']).toFixed(2)}</td>
                                        <td> {getPercentChange(userPortfolio[key]['averagePrice'], userPortfolio[key]['currentPrice'])} % </td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            </div>
            <div className="startInvesting">
                        <button className="startInvestingButton" type="submit" onClick={goToInvestingPage}> Let's Start Investing </button>
            </div>
        </div>
    );
}

Portfolio.propTypes = {
    userName: PropTypes.string.isRequired
}

export default Portfolio;