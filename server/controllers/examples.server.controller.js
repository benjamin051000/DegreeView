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
function parse_req(pre_str){
  if(pre_str == undefined){
    return []
  }
  const reg=/( or )?(\w\w\w\s\d\d\d\d\w?( or )?)+/g;
  prereq = pre_str.match(reg)

  if(prereq == undefined){
    return []
  }

  for(var i = 0; i < prereq.length; i++){
    prereq[i] = prereq[i].split(" or ");

    for(var j = 0; j < prereq.length; j++){

      if(prereq[i][j] == undefined){
        break;
      }

      prereq[i][j] = prereq[i][j].replace(" ","");

      if(j == prereq[i].length - 1 && prereq[i][j] == ''){
        prereq[i].pop();
      }
    }
  }
  return prereq;
}

function process_course(course_code){
  var course_info = get_course(course_code);
  var course = JSON.parse(course_info.substring(1, course_info.length-1))["COURSES"][0];

  if(course['prerequisites'].includes("Coreq")){
    var info = course['prerequisites'].split("Coreq:");
    var coreq = info[1];
    var prereq = info[0];
  }
  else{
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
exports.getCourseInfo = async function(req, res) {
    // res.send(await fetchCourses(req.courseCode));
    res.send(get_course(req.params.courseCode));
}
