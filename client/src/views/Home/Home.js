import './Home.css';
import React, { useState } from 'react';
import OverviewFlow from './OverviewFlow.js';
import CourseSidebar from '../../components/CourseSidebar.js';

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
    const [courseSidebarData, setSideBar] = useState({});
    
    return (
        <div className="App">
            <header className="App-header">
                {/* <div></div> */}
                <CourseSidebar>
                    <div style={{ marginLeft: "100px", marginTop: "100px", className: "ui container", width: "1600px", height: "800px" }}>
                        <OverviewFlow />
                    </div>
                </CourseSidebar>
            </header>
        </div>
    );
}

export default Home;
