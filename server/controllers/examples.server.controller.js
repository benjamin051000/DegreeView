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
  const reg=/(( or )?([A-Z][A-Z][A-Z]\s\d\d\d\d\w?))+/g;
  prereq = pre_str.match(reg)

  if(prereq == undefined){
    return []
  }

  for(var i = 0; i < prereq.length; i++){
    prereq[i] = prereq[i].replace(/ or /g, ",");
    prereq[i] = prereq[i].replace(/ /g,"");
    }
  return prereq;
}

function process_course(course_code){
  var course_info = get_course(course_code);
  var remove = ["AP credit for MAC 2311", "with a minimum grade of C", "(", ") ", "or a passing score on Chem placement plus no attempt of CHM 1025 w/grade <C or W, and MAC 1147, or MAC 1140 plus MAC 1114, or higher MAC course with a minimum grade of C.", "or (MAC 1140 and MAC 1114or MAC 23##)"]
  var course = JSON.parse(course_info.substring(1, course_info.length-1))["COURSES"][0];
  //console.log(course_code)
  //console.log(course['prerequisites'])
  for(var i = 0; i < remove.length; i++){
    course['prerequisites'] = course['prerequisites'].replace(remove[i], "")
  }
  //console.log(course['prerequisites'])
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
function get_eligible_courses(courses, taken){
  var eligible = []
  //For each course, check if pre-reqs are in taken
  for(var i = 0; i < courses.length; i++){
    var prereq = []
    for(var j = 0; j < courses[i]['prereq'].length; j++){
      prereq.push(courses[i]['prereq'][j])
    }

    if(prereq.length == 0){
      eligible.push(courses[i])
      continue;
    }

    //Check
    var has_prereq = true
    for(var j = 0; j < prereq.length; j++){
      prereq[j] = prereq[j].split(",")

      var found = false
      for(var k = 0; k < prereq[j].length; k++){
        if(taken.includes(prereq[j][k])){
          found = true
          break
        }
      }
      if(!found){
        has_prereq = false
        break
      }
    }

    if(has_prereq){
      eligible.push(courses[i])
    }

  }
  return eligible
}
function check_coreq(eligible, taken){
  //Check if coreqs are in courses or in taken
  var eligible_courses = []
  for(var i = 0; i < eligible.length; i++){
    coreq = eligible[i]['coreq']
    if(coreq.length == 0){
      eligible_courses.push(eligible[i])
      continue;
    }
    //Check if coreq is in taken or in eligible
    var found = false;
    for(var j = 0; j<coreq.length; j++){
      //Check if coreq is in taken
      if(taken.includes(coreq[j])){
        found = true
        break
      }

      //Check if coreq requirement is in eligible
      for(var k = 0; k < eligible.length; k++){
        if(coreq[j] == eligible[k].code){
          found = true
          break
        }
      }
    }

    if(found){
      eligible_courses.push(eligible[i])
    }
  }

  return eligible_courses
}
function build_semester(required, taken){
  
  var semester = []
  var eligible = get_eligible_courses(required, taken)
  var eligible = check_coreq(eligible, taken)
  for(var i = 0; i<eligible.length;i++){
    taken.push(eligible[i].code)
    semester.push(eligible[i])
    remove_req(required, eligible[i].code)
  }

  return semester

}
function full_schedule(major, general, taken){
  var required = []

  for(var i = 0; i<major['core'].length;i++){
    required.push(major['core'][i])
  }
  for(var i = 0; i<general['core'].length;i++){
    required.push(general['core'][i])
  }

  num_taken = taken.length
  total_required = required.length + num_taken

  //Get class data for each class in the major
  for(var i = 0; i < required.length; i++){
    required[i] = process_course(required[i])
  }

  for(var i = 0; i<taken.length; i++){
    remove_req(required, taken[i]);
  }

  for(zz = 0; zz < 9; zz++){
    var semester = build_semester(required, taken)
    console.log("Semester " + (zz+1))
    for(var i = 0; i < semester.length; i++){
      console.log(semester[i].code)
    }
  }
}
function remove_req(req, course){

  for(var i = 0; i < req.length; i++){
    if(req[i].code == course){
      req.splice(i, 1)
      return
    }
  }
}
exports.getCourseInfo = async function(req, res) {
    // res.send(await fetchCourses(req.courseCode));
    res.send(get_course(req.params.courseCode));
}
//console.log(process_course("PHY2048"))
majors = {
  "ChemE": {
    "core": [
      "ECH4224L",
      "ECH3101",
      "ECH4404L",
      "ECH3023",
      "ECH3264",
      "ECH3203",
      "ECH3223",
      "COT3502",
      "PHY2048L",
      "PHY2049L",
      "CHM2045L",
      "CHM2046L",
      "STA3032",
      "EEL3003",
      "CHM4411",
      "CHM2210",
      "CHM2211",
      "CHM2211L",
      "ECH4123",
      "ECH4824",
      "ECH4504",
      "ECH4403",
      "ECH4714",
      "ECH4323",
      "ECH4323L",
      "ECH4604",
      "ECH4644",
      "ECH4934"
    ],
    "electives": [],
    "required_elective1": 9,
    "required_elective2": 3,
    "required_elective3": 0,
    "elective1": [
      ""
    ]
  },
  "GenEngineer": {
    "core": [
      "CHM2045",
      "CHM2046",
      "MAC2311",
      "MAC2312",
      "MAC2313",
      "MAP2302",
      "PHY2048",
      "PHY2049",
      "ENC3246"
    ],
    "electives": [],
    "required_elective1": 9,
    "required_elective2": 3,
    "required_elective3": 0,
    "elective1": [
      ""
    ]
  },
  "CompE": {
    "core": [
      "COP3502",
      "COP3503",
      "COT3100",
      "EEL3701C",
      "ENC3246",
      "CDA3101",
      "COP3530",
      "EEL3111C",
      "EEL4744C",
      "MAS3114",
      "CEN3031",
      "STA3032",
      "EEL4712C",
      "COP4600",
      "EEL3135",
      "EEL3923C,CEN3913",
      "CEN4914,EEL4924C"
    ],
    "electives": [],
    "required_elective1": 9,
    "required_elective2": 3,
    "required_elective3": 0,
    "elective1": [
      ""
    ]
  },
  "CS": {
    "core": [
      "COP3502",
      "COP3503",
      "COT3100",
      "COP3530",
      "CEN3031",
      "ENC3246",
      "MAS3114,MAS4105",
      "CDA3101",
      "CIS4301",
      "COT4501",
      "COP4600",
      "EEL3701C",
      "EGN4034",
      "CNT4007C",
      "CIS4914,CIS4913C",
      "STA3032"
    ],
    "electives": [],
    "required_elective1": 9,
    "required_elective2": 3,
    "required_elective3": 0,
    "elective1": [
      ""
    ]
  },
  "MechE": {
    "core": [
      "EML2023",
      "ENC3246",
      "COP2271",
      "EGM2511",
      "EML2322L",
      "EGM3344",
      "EGM3520",
      "EMA3010",
      "EML3100",
      "EEL3003",
      "EGM3401",
      "EGN3353C",
      "EML3301C",
      "EML3005",
      "EML4140",
      "EML4220",
      "EML4312",
      "EML4147C",
      "EML4501,EAS4700,EAS4710",
      "EML4507",
      "EML4314C",
      "EML4321",
      "EML4502"
    ],
    "electives": [],
    "required_elective1": 9,
    "required_elective2": 3,
    "required_elective3": 0,
    "elective1": [
      ""
    ]
  },
  "Finance": {
    "core": [
      "ECO2023",
      "ECO2013",
      "ACG2021",
      "CGS2531,ISM3013",
      "ACG2071",
      "GEB4941",
      "STA2023",
      "GEB3213,GEB3218,SPC2608,ENC3312",
      "FIN3403",
      "MAN3025",
      "QMB3250",
      "FIN4243",
      "BUL4310",
      "MAR3023",
      "ACG3101",
      "ACG4111",
      "FIN4504",
      "GEB3373",
      "FIN4414",
      "MAN4504"
    ],
    "electives": [],
    "required_elective1": 9,
    "required_elective2": 3,
    "required_elective3": 0,
    "elective1": [
      ""
    ]
  },
  "Botany": {
    "core": [
      "BOT2010C",
      "BSC2010",
      "BSC2010L",
      "BSC2011",
      "BSC2011L",
      "BOT2011C",
      "STA2023,COP2800,COP3275,BSC2891",
      "CHM2200",
      "CHM2200L",
      "PCB4043C,PCB3601C,BOT3151C,BSC3307C",
      "PCB4674",
      "AGR3303,PCB3063",
      "BOT2710C",
      "BOT4935,BOT5225C,PCB3023",
      "BOT3503",
      "BOT3503L",
      "PCB4043C,PCB3601C,BOT3151C,BSC3307C",
      "BSC4936"
    ],
    "electives": [],
    "required_elective1": 9,
    "required_elective2": 3,
    "required_elective3": 0,
    "elective1": [
      ""
    ]
  }
}
full_schedule(majors['ChemE'], majors["GenEngineer"], ["PHY2020", "CHM1025", "ENC1101", "ENC1102", "MAC1147", "MAC1114"])
