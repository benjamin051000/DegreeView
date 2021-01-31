import './Home.css';
import React from 'react';
import OverviewFlow from './OverviewFlow.js';


function Home() {
    

    return (
        <div className="App">
            <header className="App-header">
                <div></div>
                <div style={{marginLeft:"100px", marginTop:"100px", className:"ui container", width:"1600px", height:"800px"}}>
                    <OverviewFlow/>
                    
                </div>
            </header>
        </div>
    );
}

export default Home;
