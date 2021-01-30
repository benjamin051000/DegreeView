import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import twouf from '../../assets/TWOUF.jpg'


//Set website header, includes the bar with home 
const Header = () => {


    return (
        <div style={{height:"60px", backgroundColor:"rgb(40, 87, 151)", borderBottom:"3px solid rgb(224, 129, 46)"}} className="ui fixed menu">
           
                <div className="ui fluid container">
                    <a href="#" className="header item" style={{font:"font-size: 1.5rem font-family: Roboto font-weight: 400 line-height: 1.334", color:"white"}}>
                    <img style={{marginRight:"20px"}} className="logo" src={twouf} alt="TWODOTUF"/>
                        TwoDotUF
                    </a>
                </div>
            
        </div>
    )
}

export default Header;
