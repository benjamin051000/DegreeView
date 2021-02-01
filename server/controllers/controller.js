import db from '../config/DBConfig.js';

import __getCourseInfo from '../functions/GetCourseInfo.js';

import { runFlow, process_course } from '../functions/GetSemester.js';


/**
 * Accesses database of major requirement courses, and 
 * returns an array of required courses for a given major.
 * @param {object} req - request includes a major 
 * (which currently must follow database naming convention)
 * @param {object} res - response sends a list of course 
 * codes which are required for the given major.
 */
const retrieveRequirements = async (req, res) => {
    console.group(); // Indents the following console logs

    const major = req.params.major;

    // get all the requirements from the database
    let majors = [major, 'GenEngineer']; // For engineering majors
    let all_reqs = [];

    // For each major the student is in, get the major requirements.
    for(let major of majors) {
        let courseData = await db.collection('majors').doc(major).get();

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


/**
 * Constructs a list of classes a student can take given 
 * their previously taken courses, with a focus on major
 * requirements.
 * @param {object} req - request includes major with a 
 * POST body of taken classes and major requirements.
 * @param {object} res - repsonse includes an array of 
 * courses described above.
 */
const build_semester = (req, res) => {
    let major = req.params.major;
    let { takenClasses, majorReqs } = req.body;

    // Run the flow
    let results = runFlow(major, takenClasses, majorReqs);

    res.send(results);
}


/**
 * Uses the ONE.UF API to retrieve information about a particular course.
 * @param {object} req - Pass the course code as a request parameter.
 * @param {object} res - Sends response with course info.
 */
const getCourseInfo = (req, res) => {
    let course_code = req.params.courseCode;
    
    console.log('Fetching course code info for:', course_code);

    const data = __getCourseInfo(course_code);

    res.send(data);
}


/**
 * Tests the database by retrieving
 * a simple collection and displaying it.
 * NOTE: This is for debugging purposes only.
 */
const testDB = async (_, res) => {

    let major = 'ChemE';
    const info = await db.collection('majors').doc(major).get();

    if (!info.exists) {
        console.log(`ERROR: ${major} does not exist in the DB.`);
        res.send(500);
    }
    else {
        res.send(info);
    }
}


export {
    retrieveRequirements,
    build_semester,
    getCourseInfo,
    testDB
};