// const Example = require('../models/examples.server.model.js')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Firestore = require('@google-cloud/firestore').Firestore;


function parse_req(pre_str) {
  if (pre_str == undefined) {
    return []
  }
  const reg = /( or )?(\w\w\w\s\d\d\d\d\w?( or )?)+/g;
  prereq = pre_str.match(reg)

  if (prereq == undefined) {
    return []
  }

  for (var i = 0; i < prereq.length; i++) {
    prereq[i] = prereq[i].split(" or ");

    for (var j = 0; j < prereq.length; j++) {

      if (prereq[i][j] == undefined) {
        break;
      }

      prereq[i][j] = prereq[i][j].replace(" ", "");

      if (j == prereq[i].length - 1 && prereq[i][j] == '') {
        prereq[i].pop();
      }
    }
  }
  return prereq;
}


function process_course(course_code) {
  var course_info = get_course(course_code);
  var course = JSON.parse(course_info.substring(1, course_info.length - 1))["COURSES"][0];

  if (course['prerequisites'].includes("Coreq")) {
    var info = course['prerequisites'].split("Coreq:");
    var coreq = info[1];
    var prereq = info[0];
  }
  else {
    var prereq = course['prerequisites'];
    var coreq = "";
  }

  var course = {
    name: course['name'],
    code: course['code'],
    desc: course['description'],
    credits: course['sections'][0]['credits'],
    prereq: parse_req(prereq),
    coreq: parse_req(coreq)
  };

  return course
}

/**
 * Obtains information about a particular course.
 */
exports.getCourseInfo = function (req, res) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "https://one.ufl.edu/apix/soc/schedule/?category=CWSP&term=2211&course_code&course-code=" + course_code, false); // false for synchronous request
  xmlHttp.send(null);
  //   console.log(xmlHttp)
  res.send(xmlHttp.responseText);
}

/* Setup DB */
const db = new Firestore({
  projectId: 'swamphacks-2021',
  keyFilename: 'server/config/SwampHacks 2021-af160589d296.json',
});

/**
 * Tests the database by retrieving 
 * a simple collection and displaying it.
 * NOTE: This is for debugging purposes only.
 */
exports.testDB = async function (req, res) {

  let major = 'Chemical Engineer';
  const doc = db.collection('test').doc(major);
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
 */
exports.getReqs = async function (req, res) {
  const major = req.params.major;
  const doc = db.collection('test').doc(major);
  const courseData = await doc.get();

  if(!courseData.exists) {
    console.log(`ERROR: ${major} does not exist in the DB.`);
    res.send(`ERROR: ${major} does not exist in the DB.`);
  }
  else {
    res.send(courseData);
  }
}

/**
 * Helper function that adds a major's 
 * requirements to the database.
 */
const fs = require('fs');
const fsPromises = require('fs').promises; // used for promise .then's
const addData = async function () {
  let data = await fs.promises.readFile('./server/majors.json');
  let json = await JSON.parse(data);

    console.log(json)
  
    for (var majorName in json) {
     // console.log(majorName);

       let coreClasses = json[majorName]["core"];
      // let electives = json[majorName]["electives"];
      // let required_elective1 = json[majorName]["required_elective1"];
      // let required_elective2 = json[majorName]["required_elective2"];
      // let required_elective3 = json[majorName]["required_elective3"];
      // let required_elective3 = json[majorName]["required_elective3"];

    for(var index in coreClasses){
      //console.log(coreClasses[index]);
      let classNumber = coreClasses[index];
      // const db_res = db.collection('majors').doc(majorName).set({
      //   'core': classNumber
     // });
    }
  }

   const db_res = await db.collection('majors').doc('bruh').set({'core': 'bruh'});
  
  /**
   * if(err) {console.log(err);}

    let json = JSON.parse(data);

    let major = ''; // TODO is this correct?
    const db_res = db.collection('majors').doc(major).set(data);
    console.log(db_res);

   */
}

// TODO remove, this is just a helper function to add stuff to DB
// and is not part of production
addData();