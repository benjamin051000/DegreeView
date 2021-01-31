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
 * @param {array} takenClasses - pass by reference
 */
async function getSemester(major, takenClasses) {
    const options = {
        method: 'POST',
        body: JSON.stringify(takenClasses),
        headers: { 'Content-Type': 'application/json' }
    }

    const url = `/api/buildsemester/${major}`;

    let response = await fetch(url, options);
    let data = await response.json();

    /* Add everything from data to takenClasses.
    TODO make a feature where user checks off classes */
    for(let course of data) {
        takenClasses.push(course.code);
    }
    console.log('New takenClasses:', takenClasses);

    return data;
}

function make_nodes(semester) {

    let nodes = [];

    for (let data of semester) {
        const id = data.code;
        const label = `${id} (${data.credits})`;
        const pos = { x: 300 + i * 500, y: 400 }; // About centerscreen

        nodes.push(makeNode(id, label, pos));
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
let i = 0; // For offsetting semester nodes

function Home() {
    const [nodes, setNodes] = useState([]);

    const handleClick = async () => {
        const semester = await getSemester('ChemE', takenClasses);
        console.log('Unedited semester:', semester);
        let nodes = make_nodes(semester);
        setNodes(nodes);
        i++;
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
                <button onClick={handleClick}>Build sem</button>
                <CourseSidebar>
                    <div style={{ className: "ui container", width: "1800px", height: "800px" }}>
                        <OverviewFlow nodes={nodes} setNodes={setNodes} />
                    </div>
                </CourseSidebar>

            </header>
        </div>
    );
}

export default Home;
