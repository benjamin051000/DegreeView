// import XMLHttpRequest from "xmlhttprequest";
import db from '../config/DBConfig.js';
// import https from 'https';
import __getCourseInfo from '../functions/GetCourseInfo.js';

import {runFlow, process_course} from '../functions/GetSemester.js';

const retrieveRequirements = async function (req, res) {
  const major = req.params.major;

  // get all the requirements from the database 
  let majorReqs, genReqs;

  let doc = db.collection('majors').doc(major);
  let courseData = await doc.get();

  if (!courseData.exists) {
    console.log(`ERROR: ${major} does not exist in the DB.`);
  }
  else {
    // Format as an array
    let arr = courseData['_fieldsProto']['core']['arrayValue']['values'];
    arr = arr.map(e => e['stringValue']);
    console.log(arr);
    majorReqs = arr;
  }

  // Do the same for general engineering reqs

  doc = db.collection('majors').doc('GenEngineer');
  courseData = await doc.get();

  if (!courseData.exists) {
    console.log(`ERROR: ${major} does not exist in the DB.`);
  }
  else {
    // Format as an array
    let arr = courseData['_fieldsProto']['core']['arrayValue']['values'];
    arr = arr.map(e => e['stringValue']);
    console.log(arr);
    genReqs = arr;
  }

  console.log('>>>\tmajorReqs:', majorReqs);
  console.log('>>>\tgenReqs:', genReqs);

  // put them into one array.
  let reqs = [];
  for (let e of majorReqs) {
    console.log('Processing course:', e);
    reqs.push(await process_course(e));
  }

  for (let e of genReqs) {
    console.log('Processing course:', e);
    reqs.push(await process_course(e));
  }

  res.send(reqs);
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