// import XMLHttpRequest from "xmlhttprequest";
import db from '../config/DBConfig.js';
// import https from 'https';
import __getCourseInfo from '../functions/GetCourseInfo.js';

import { runFlow, process_course } from '../functions/GetSemester.js';

const retrieveRequirements = async function (req, res) {
    console.group(); // Indents the following console logs

    const major = req.params.major;

    // get all the requirements from the database
    let majors = [major, 'GenEngineer']; // For engineering majors
    let all_reqs = [];

    // For each major the student is in, get the major requirements.
    for(let major of majors) {
        let doc = db.collection('majors').doc(major);
        let courseData = await doc.get();

        console.log("courseData:", courseData);

        if (!courseData.exists) {
            console.error(`ERROR: ${major} does not exist in the DB.`);
            res.send(500); // Internal server error
            return;
        }
        else {
            // Get each course code.
            let arr = courseData._fieldsProto.core.arrayValue.values;
            arr = arr.map(e => e.stringValue);

            all_reqs.push(...arr); // Spread operator (...) Adds arr (an array) to total_reqs element-wise
        }
    }

    console.log("Getting course info for:", all_reqs);
    let reqs = await Promise.all(all_reqs.map(async e => await process_course(e)));

    console.log('Requirement information collected successfully.');

    res.send(reqs);

    console.groupEnd(); // Unindents
}

const build_semester = function (req, res) {
    let major = req.params.major;
    let { takenClasses, majorReqs } = req.body;

    // Run the flow
    let results = runFlow(major, takenClasses, majorReqs);
    console.log('============================================')
    console.log('results:', results);

    res.send(results);
}

/**
 * Obtains information about a particular course.
 */
// const getCourseInfo = function (req, res) {
//   let course_code = req.params.courseCode;
//   var xmlHttp = new XMLHttpRequest.XMLHttpRequest();
//   xmlHttp.open("GET", "https://one.ufl.edu/apix/soc/schedule/?category=CWSP&term=2211&course_code&course-code=" + course_code, false); // false for synchronous request
//   xmlHttp.send(null);
//   //   console.log(xmlHttp)
//   res.send(xmlHttp.responseText);
// }

const getCourseInfo = async (req, res) => {
    console.group();
    let course_code = req.params.courseCode;
    console.log('Fetching course code info for', course_code);

    const data = __getCourseInfo(course_code);

    res.send(data);
}



/**
 * Tests the database by retrieving
 * a simple collection and displaying it.
 * NOTE: This is for debugging purposes only.
 */
const testDB = async function (req, res) {

    let major = 'ChemE';
    const doc = db.collection('majors').doc(major);
    const info = await doc.get();

    if (!info.exists) {
        console.log(`ERROR: ${major} does not exist in the DB.`);
        res.send(404);
    }
    else {
        res.send(info);
    }
}

/**
 * Gets a major document from the database.
 * TODO Unused at the moment
 */
const getReqs = async function (req, res) {
    const major = req.params.major;
    const doc = db.collection('majors').doc(major);
    const courseData = await doc.get();

    if (!courseData.exists) {
        console.log(`ERROR: ${major} does not exist in the DB.`);
        res.send(`ERROR: ${major} does not exist in the DB.`);
    }
    else {
        // Format as an array
        let arr = courseData['_fieldsProto']['core']['arrayValue']['values'];
        arr = arr.map(e => e['stringValue']);
        console.log(arr);
        res.send(arr);
    }
}

export {
    retrieveRequirements,
    build_semester,
    getCourseInfo,
    testDB
};