import './Home.css';
import React from 'react';
import OverviewFlow from './OverviewFlow.js';


function Home() {
    

    return (
        <div className="App">
            <header className="App-header">
                <div style={{fontFamily: "Lato,'Helvetica Neue', Arial, Helvetica, sans-serif", fontWeight: "700", fontSize:"15pt", backgroundColor:"#c0c4cf", marginTop:"60px", width:"1800px", textAlign:"center", borderRadius:"0px 0px 0px 0px"}} className="ui eight item menu">
                    <div className="item" style={{color:"#4a4e4e", paddingTop:"16px", textAlign:"center"}}>Spring 2021</div>
                    <div className="item" style={{color:"#4a4e4e", paddingTop:"16px"}}>Summer 2021</div>
                    <div className="item" style={{color:"#4a4e4e", paddingTop:"16px"}}>Fall 2021</div>
                    <div className="item" style={{color:"#4a4e4e", paddingTop:"16px"}}>Spring 2022</div>
                    <div className="item" style={{color:"#4a4e4e", paddingTop:"16px"}}>Summer 2022</div>
                    <div className="item" style={{color:"#4a4e4e", paddingTop:"16px"}}>Fall 2022</div>
                    <div className="item" style={{color:"#4a4e4e", paddingTop:"16px"}}>Spring 2023</div>
                    <div className="item" style={{color:"#4a4e4e", paddingTop:"16px"}}>Summer 2023</div>
                    
                </div>
                <div style={{className:"ui container", width:"1800px", height:"800px"}}>
                    <OverviewFlow/>
                </div>
            </header>
        </div>
    );
}

export default Home;
