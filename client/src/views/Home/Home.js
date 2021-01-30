import React, { useState, useEffect } from 'react';
import './Home.css';
import * as joint from 'jointjs';

function helloJoint() {

    let graph = new joint.dia.Graph();

    let paper = new joint.dia.Paper({
        el: document.getElementById('jointpaper'),
        model: graph,
        width: 600,
        height: 100,
        gridSize: 1
    });


    let rect = new joint.shapes.standard.Rectangle();
    rect.position(100, 30);
    rect.resize(100, 40);
    rect.attr({
        body: {
            fill: 'blue'
        },
        label: {
            text: 'Hello',
            fill: 'white'
        }
    });
    rect.addTo(graph);

    let rect2 = rect.clone();
    rect2.translate(300, 0);
    rect2.attr('label/text', 'World!');
    rect2.addTo(graph);

    let link = new joint.shapes.standard.Link();
    link.source(rect);
    link.target(rect2);
    link.addTo(graph);
}

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
    // These run once the Home component has loaded.
    useEffect(helloJoint, []);
    const [courseInfo, setCourseInfo] = useState({});

    console.log(courseInfo); // Debug to see courseInfo once it's retrieved.

    return (
        <div className="App">
            <header className="App-header">
                <div style={{backgroundColor:"gray", paddingTop:"30px", paddingBottom:"30px"}} className="ui container">
                    <button onClick={async () => setCourseInfo(await getCourseInfo('MAC2313'))}>Get sample course data</button>
                    <div id="jointpaper"></div>
                </div>
            </header>
        </div>
    );
}

export default Home;
