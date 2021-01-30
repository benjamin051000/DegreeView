// const Example = require('../models/examples.server.model.js')
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function get_course(course_code){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", "https://one.ufl.edu/apix/soc/schedule/?category=CWSP&term=2211&course_code&course-code=" + course_code, false ); // false for synchronous request
  xmlHttp.send( null );
//   console.log(xmlHttp)
  return xmlHttp.responseText;
}

// async function fetchCourses(courseCode) {
//     const category = "CWSP";
//     const term = 2211;

//     /* If this doesn't work, ask Benjamin. We may need to move it to the backend. */
//     // const corsHeaders = "https://cors-anywhere.herokuapp.com/";

//     let url = `http://one.ufl.edu/apix/soc/schedule/?category=${category}&term=${term}`;

//     url += `&course-code=${courseCode}`;

//     console.log("Url:", url);

//     const response = await fetch(url);
//     console.log("Response received.");

//     const data = await response.json();
//     console.log("JSON parsed.");

//     return data; // TODO return data[0] ?
// }

function process_course(course_code){
  var course_info = get_course(course_code);
  var course = JSON.parse(course_info.substring(1, course_info.length-1))["COURSES"][0];

  var info = course['prerequisites'].split(";");

  var course = {
    name: course['name'],
    code: course['code'],
    desc: course['description'],
    credits: parseInt(info[0].match(/\d\d?/g)[0]),
    prereq: info[1],
    coreq: info[2]
  };
  
  return course
}
exports.getCourseInfo = async function(req, res) {
    // res.send(await fetchCourses(req.courseCode));
    res.send(get_course(req.params.courseCode));
}
process_course("PHY2048");
