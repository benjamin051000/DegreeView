const fs = require('fs');

function get_empty_majors(major_strs){
  var majors = {};
  //Add empty majors into the dictionary for population
  for(var i = 0; i<major_strs.length; i++){
    majors[major_strs[i]] = {
      "core":[],
      "electives":[],
      "required_elective1": 9,
      "required_elective2": 3,
      "required_elective3": 0
    };
  }

  return majors
}

function parse_courses(courses){
  courses = courses.split(', ');
  for(var i = 0; i < courses.length; i++){
    courses[i] = courses[i].split(" or ")
  }
  return courses
}

function write_majors(majors){
  var str = JSON.stringify(majors, null, 2);
  fs.writeFile("majors.json", str, 'utf8', function(err){
    if (err) throw err;
    console.log("done")
    }
  );
}

function build_major(majors, major_str, core_courses, electives){
  majors[major_str]["core"] = parse_courses(core_courses);
  majors[major_str]['elective1'] = parse_courses(electives);
}

let chE_core = "ECH4224L, ECH4404L, ECH4714, ECH3023, ECH3103, ECH3203, ECH3223, ECH3264, COT3502, ECH4714, PHY2048L, PHY2049L, CHM2045L, CHM2046L, STA3032, ABE2062 or BSC2010,  EEL3003,  CHM4411, CHM2210, CHM2211, CHM2211L, ECH4123, ECH4824, ECH4504, ECH4403, ECH4403L, ECH4714, ECH4323, ECH4323L, ECH4604, ECH4644 or ECH4913, ECH4934";
var majors = get_empty_majors(["ChemE", "CE"]);
build_major(majors, "ChemE", chE_core, "");
write_majors(majors);
