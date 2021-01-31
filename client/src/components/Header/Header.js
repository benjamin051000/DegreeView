import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import twouf from '../../assets/TWOUF.jpg'
import NewModal from '../NewModal.js';
import ExportModal from '../ExportModal.js';

//Set website header, includes the bar with home 
const Header = () => {
    const exportFunction = () => {
        alert("exporting!!")
    }

    
    return (
        <div style={{height:"60px", backgroundColor:"rgb(40, 87, 151)", borderBottom:"3px solid rgb(224, 129, 46)"}} className="ui fixed menu">
           
                <div className="ui fluid container">
                    <a style={{color:"white"}} href="#" className="header item" >
                    <img style={{marginRight:"20px"}} className="logo" src={twouf} alt="TWODOTUF"/>
                        TwoDotUF
                    </a>
                    <ExportModal className="ui fixed menu"/>
                    <NewModal className="ui fixed menu"/>
                </div>
                
               
                
      

        </div>
    )
}

export default Header;
