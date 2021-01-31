// const Example = require('../models/examples.server.model.js')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const Firestore = require('@google-cloud/firestore').Firestore;

// TODO duplicate of getCourseInfo
function get_course(course_code) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "https://one.ufl.edu/apix/soc/schedule/?category=CWSP&term=2211&course_code&course-code=" + course_code, false); // false for synchronous request
  xmlHttp.send(null);
  //   console.log(xmlHttp)
  return xmlHttp.responseText;
}

function parse_req(pre_str) {
  if (pre_str == undefined) {
    return []
  }

  const reg = /(( or )?([A-Z][A-Z][A-Z]\s\d\d\d\d\w?))+/g;
  prereq = pre_str.match(reg)

  if (prereq == undefined) {
    return []
  }

  for (var i = 0; i < prereq.length; i++) {
    prereq[i] = prereq[i].replace(/ or /g, ",");
    prereq[i] = prereq[i].replace(/ /g, "");
  }
  return prereq;
}

function process_course(course_code) {
  var course_info = get_course(course_code);
  var remove = ["AP credit for MAC 2311", "with a minimum grade of C", "(", ") ", "or a passing score on Chem placement plus no attempt of CHM 1025 w/grade <C or W, and MAC 1147, or MAC 1140 plus MAC 1114, or higher MAC course with a minimum grade of C.", "or (MAC 1140 and MAC 1114or MAC 23##)"]
  var course = JSON.parse(course_info.substring(1, course_info.length - 1))["COURSES"][0];
  //console.log(course_code)
  //console.log(course['prerequisites'])
  for (var i = 0; i < remove.length; i++) {
    course['prerequisites'] = course['prerequisites'].replace(remove[i], "")
  }
  //console.log(course['prerequisites'])
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
function get_eligible_courses(courses, taken) {
  var eligible = []
  //For each course, check if pre-reqs are in taken
  for (var i = 0; i < courses.length; i++) {
    var prereq = []
    for (var j = 0; j < courses[i]['prereq'].length; j++) {
      prereq.push(courses[i]['prereq'][j])
    }

    if (prereq.length == 0) {
      eligible.push(courses[i])
      continue;
    }

    //Check
    var has_prereq = true
    for (var j = 0; j < prereq.length; j++) {
      prereq[j] = prereq[j].split(",")

      var found = false
      for (var k = 0; k < prereq[j].length; k++) {
        if (taken.includes(prereq[j][k])) {
          found = true
          break
        }
      }
      if (!found) {
        has_prereq = false
        break
      }
    }

    if (has_prereq) {
      eligible.push(courses[i])
    }

  }
  return eligible
}
function check_coreq(eligible, taken) {
  //Check if coreqs are in courses or in taken
  var eligible_courses = []
  for (var i = 0; i < eligible.length; i++) {
    coreq = eligible[i]['coreq']
    if (coreq.length == 0) {
      eligible_courses.push(eligible[i])
      continue;
    }
    //Check if coreq is in taken or in eligible
    var found = false;
    for (var j = 0; j < coreq.length; j++) {
      //Check if coreq is in taken
      if (taken.includes(coreq[j])) {
        found = true
        break
      }

      //Check if coreq requirement is in eligible
      for (var k = 0; k < eligible.length; k++) {
        if (coreq[j] == eligible[k].code) {
          found = true
          break
        }
      }
    }

    if (found) {
      eligible_courses.push(eligible[i])
    }
  }

  return eligible_courses
}
function __build_semester(required, taken) {

  var semester = []
  var eligible = get_eligible_courses(required, taken)
  var eligible = check_coreq(eligible, taken)
  for (var i = 0; i < eligible.length; i++) {
    taken.push(eligible[i].code)
    semester.push(eligible[i])
    remove_req(required, eligible[i].code)
  }

  return semester

}
function full_schedule(major, general, taken) {
  var required = []

  for (var i = 0; i < major['core'].length; i++) {
    required.push(major['core'][i])
  }
  for (var i = 0; i < general['core'].length; i++) {
    required.push(general['core'][i])
  }

  num_taken = taken.length
  total_required = required.length + num_taken

  //Get class data for each class in the major
  for (var i = 0; i < required.length; i++) {
    required[i] = process_course(required[i])
  }

  for (var i = 0; i < taken.length; i++) {
    remove_req(required, taken[i]);
  }

  for (var zz = 0; zz < 9; zz++) {
    var semester = build_semester(required, taken)
    console.log("Semester " + (zz + 1))
    for (var i = 0; i < semester.length; i++) {
      console.log(semester[i].code)
    }
  }
}
function remove_req(req, course) {

  for (var i = 0; i < req.length; i++) {
    if (req[i].code == course) {
      req.splice(i, 1)
      return
    }
  }
}

/**
 * 
 * @param {string} majorReqs - your major (in the format of the database doc name)
 * @param {array} takenClasses - the course codes you've taken already.
 */
const runFlow = async function (major, takenClasses = ["PHY2020", "CHM1025", "ENC1101", "ENC1102", "MAC1147", "MAC1114"]) {
  // TODO These are just placeholders for now 

  console.log(`>>>\tRunning flow with major: "${major}" and taken classes:`, takenClasses);

  // Get major requirements
  // const majorReqs = db.collection('majors').doc(major);
  // const genReqs = db.collection('majors').doc('GenEngineer');

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
    reqs.push(process_course(e));
  }

  for (let e of genReqs) {
    console.log('Processing course:', e);
    reqs.push(process_course(e));
  }

  // console.log('>>>\treqs:', reqs);

  // courses array is done.
  console.log('Building semester...');

  let semester = __build_semester(reqs, takenClasses);

  console.log('Semester built.');

  // console.log('>>>\tSemester:', semester);

  return semester;
}

exports.build_semester = function (req, res) {
  let major = req.params.major;
  let takenClasses = req.body;

  // Run the flow
  runFlow(major, takenClasses).then(results => {
    console.log('============================================')
    console.log('results:', results);

    res.send(results);
  });
}

/**
 * Obtains information about a particular course.
 */
exports.getCourseInfo = function (req, res) {
  let course_code = req.params.courseCode;
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
 */
exports.getReqs = async function (req, res) {
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

/**
 * Helper function that adds a major's 
 * requirements to the database.
 */
const fs = require('fs');
const fsPromises = require('fs').promises;

const addData = async function () {
  let data = await fs.promises.readFile('./server/majors.json');
  let json = await JSON.parse(data);

  for (var majorName in json) {
    let courses = json[majorName]["core"];
    console.log(courses);
    const db_res = db.collection('majors').doc(majorName).set({ "core": courses });
  }
}
// TODO remove, this is just a helper function to add stuff to DB
// and is not part of production
// // addData();
