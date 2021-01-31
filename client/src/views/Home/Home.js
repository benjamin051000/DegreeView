import './Home.css';
import React from 'react';
import OverviewFlow from './OverviewFlow.js';

/**
 * Retrieves course information via the backend API endpoint.
 * @param {string} courseCode - code of the course (e.g. MAC2312).
 */
async function getCourseInfo(courseCode) {
    const response = await fetch(`/api/getCourseInfo/${courseCode}`);
    const data = await response.json();
    // console.log("Data from backend:", data);
    return data[0]; // ONE.UF returns this in an array.
}


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
