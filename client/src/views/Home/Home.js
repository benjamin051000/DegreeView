import './Home.css';
import React, { useState } from 'react';
import OverviewFlow from './OverviewFlow.js';
import CourseSidebar from '../../components/CourseSidebar.js';
import makeNode from './MakeElement.js';
import updateNodes from './OverviewFlow.js'

// Load environment variable configuration for API hostnames
const ENV_HOSTNAME = "http://localhost:5000"; //process.env.REACT_APP_API_HOST;
console.log("ENV_HOSTNAME:", ENV_HOSTNAME);


/**
 * Retrieves course information via the backend API endpoint.
 * @param {string} courseCode - code of the course (e.g. MAC2312).
 */
async function getCourseInfo(courseCode) {
    const response = await fetch(`${ENV_HOSTNAME}/api/getCourseInfo/${courseCode}`);
    const data = await response.json();
    // console.log("Data from backend:", data);
    return data[0]; // ONE.UF returns this in an array.
}

/**
 * Gets all the classes you can take in a semester.
 * @param {string} major
 * @param {array} takenClasses - pass by reference
 */
async function getSemester(major, takenClasses) {
    const options = {
        method: 'POST',
        body: JSON.stringify({takenClasses, majorReqs}),
        headers: { 'Content-Type': 'application/json' }
    }

    const url = `${ENV_HOSTNAME}/api/buildsemester/${major}`;

    let response = await fetch(url, options);
    let data = await response.json();

    /* Add everything from data to takenClasses.
    TODO make a feature where user checks off classes */
    for(let course of data) {
        takenClasses.push(course.code);

        for(let idx = 0; idx < majorReqs.length; idx++) {
            if(majorReqs[idx].code === course.code) {
                majorReqs.splice(idx, 1);
                break;
            }
        }
    }

    console.log('New takenClasses:', takenClasses);

    return data;
}

let requirementsLoaded = false;
let majorReqs = [];
async function getRequirements(major) {
    let response = await fetch(`${ENV_HOSTNAME}/api/getReqs/${major}`);
    let data = await response.json();
    
    requirementsLoaded = true;
    return data;
}

let i = 0; // For offsetting semester nodes
function make_nodes(semester) {

    let nodes = [];

    let j = 0;

    for (let data of semester) {
        const pos = { x: 40 + i * 225, y: 5 + 133/2 * j }; // About centerscreen
        nodes.push(makeNode(data, pos));
        j++;
    }

    return nodes;
}

let takenClasses = [
    "PHY2020",
    "CHM1025",
    "ENC1101",
    "ENC1102",
    "MAC1147",
    "MAC1114"
];


function Home() {
    const [nodes, setNodes] = useState([]);

    if(!requirementsLoaded) {
        getRequirements('ChemE').then( reqs => {
            majorReqs = reqs;
            console.log('Just got the requirements here:', majorReqs);
        });
    }

    const handleClick = async () => {
        const semester = await getSemester('ChemE', takenClasses);
        console.log('Unedited semester:', semester);
        let newnodes = make_nodes(semester);
        newnodes.push(...nodes);
        setNodes(newnodes);
    }

    return (
        <div className="App">
            <header className="App-header">

                <div style={{ fontFamily: "Lato,'Helvetica Neue', Arial, Helvetica, sans-serif", fontWeight: "700", fontSize: "15pt", backgroundColor: "#c0c4cf", marginTop: "60px", width: "1800px", textAlign: "center", borderRadius: "0px 0px 0px 0px" }} className="ui eight item menu">
                    <div className="item" style={{ color: "#4a4e4e", paddingTop: "16px", textAlign: "center" }}>Spring 2021</div>
                    <div className="item" style={{ color: "#4a4e4e", paddingTop: "16px" }}>Summer 2021</div>
                    <div className="item" style={{ color: "#4a4e4e", paddingTop: "16px" }}>Fall 2021</div>
                    <div className="item" style={{ color: "#4a4e4e", paddingTop: "16px" }}>Spring 2022</div>
                    <div className="item" style={{ color: "#4a4e4e", paddingTop: "16px" }}>Summer 2022</div>
                    <div className="item" style={{ color: "#4a4e4e", paddingTop: "16px" }}>Fall 2022</div>
                    <div className="item" style={{ color: "#4a4e4e", paddingTop: "16px" }}>Spring 2023</div>
                    <div className="item" style={{ color: "#4a4e4e", paddingTop: "16px" }}>Summer 2023</div>
                </div>
                
                <CourseSidebar>
                    <div style={{ className: "ui container", width: "1800px", height: "800px" }}>
                        <OverviewFlow nodes={nodes} setNodes={setNodes} />
                    </div>
                </CourseSidebar>
                <button style={{backgroundColor:"#c0c4cf", marginTop:"-5px"}} className="ui button" onClick={handleClick}>Build Semester</button>

            </header>
        </div>
    );
}

export default Home;
