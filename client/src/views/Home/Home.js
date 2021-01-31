import './Home.css';
import React, { useState } from 'react';
import OverviewFlow from './OverviewFlow.js';
import CourseSidebar from '../../components/CourseSidebar.js';
import makeNode from './MakeElement.js';

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

/**
 * Gets all the classes you can take in a semester.
 * @param {string} major 
 */
async function getSemester(major='ChemE') {
    const options = {
        method: 'POST',
        body: JSON.stringify([
            "PHY2020",
            "CHM1025",
            "ENC1101",
            "ENC1102",
            "MAC1147",
            "MAC1114"
        ]),
        headers: {'Content-Type': 'application/json'}
    }

    const url = `/api/buildsemester/${major}`;
    
    let response = await fetch(url, options);
    let data = await response.json();
    return data;
}

function make_nodes(semester) {

    let nodes = [];

    for(let data of semester) {
        const id = data.code;
        const label = `${id} (${data.credits})`;
        const pos = {x:800, y:400}; // About centerscreen

        nodes.push(makeNode(id, label, pos));
    }

    return nodes;
}

function Home() {
    const [nodes, setNodes] = useState([]);

    const handleClick = async () => {
        let semester = await getSemester();
        console.log('Unedited semester:', semester);
        let nodes = make_nodes(semester);
        setNodes(nodes);
    }
    
    return (
        <div className="App">
            <header className="App-header">
                <CourseSidebar>
                    <div style={{ marginLeft: "100px", marginTop: "100px", className: "ui container", width: "1600px", height: "800px" }}>

                        <OverviewFlow nodes={nodes} setNodes={setNodes}/>
                    </div>

                </CourseSidebar>
            </header>
            <button onClick={handleClick}>Build sem</button>
        </div>
    );
}

export default Home;
