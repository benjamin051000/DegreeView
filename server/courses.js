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
    courses[i] = courses[i].replace(/ or /g, ",")
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

let chE_core = "ECH3101, ECH4224L, ECH4404L, ECH3023, ECH3264, ECH3203, ECH3223, ECH3264, COT3502, PHY2048L, PHY2049L, CHM2045L, CHM2046L, STA3032, EEL3003, CHM4411, CHM2210, CHM2211, CHM2211L, ECH4123, ECH4824, ECH4504, ECH4403, ECH4714, ECH4323, ECH4323L, ECH4604, ECH4644, ECH4934";
let gen_engineering = "CHM2045, CHM2046, MAC2311, MAC2312, MAC2313, MAP2302, PHY2048, PHY2049, ENC3246"
let comp = "COP3502, COP3503, COT3100, EEL3701C, ENC3246, CDA3101, COP3530, EEL3111C, EEL4744C, MAS3114, CEN3031, STA3032, EEL4712C, COP4600, EEL3135, EEL3923C or CEN3913, CEN4914 or EEL4924C"
let CS = "COP3502, COP3503, COT3100, COP3530, CEN3031, ENC3246, MAS3114 or MAS4105, CDA3101, CIS4301, COT4501, COP4600, EEL3701C, EGN4034, CNT4007C, CIS4914 or CIS4913C, STA3032"
let mech = "EML2023, ENC3246, COP2271, EGM2511, EML2322L, EGM3344, EGM3520, EMA3010, EML3100, EEL3003, EGM3401, EGN3353C, EML3301C, EML3005, EML4140, EML4220, EML4312, EML4147C, EML4501 or EAS4700 or EAS4710, EML4507, EML4314C, EML4321, EML4502"
let finance = "ECO2023, ECO2013, ACG2021, CGS2531 or ISM3013, ACG2071, GEB4941, STA2023, GEB3213 or GEB3218 or SPC2608 or ENC3312, FIN3403, MAN3025, QMB3250, FIN4243, BUL4310, MAR3023, ACG3101, ACG4111, FIN4504, GEB3373, FIN4414, MAN4504"
let botany = "BOT2010C, BSC2010, BSC2010L, BSC2011, BSC2011L, BOT2011C, STA2023 or COP2800 or COP3275 or BSC2891, CHM2200, CHM2200L, PCB4043C or PCB3601C or BOT3151C or BSC3307C, PCB4674, AGR3303 or PCB3063, BOT2710C, BOT4935 or BOT5225C or PCB3023, BOT3503, BOT3503L, PCB4043C or PCB3601C or BOT3151C or BSC3307C, BSC4936"

var majors = get_empty_majors(["ChemE", "GenEngineer", "CompE", "CS", "MechE", "Finance", "Botany"]);
build_major(majors, "ChemE", chE_core, "");
build_major(majors, "GenEngineer", gen_engineering, "");
build_major(majors, "CompE", comp, "");
build_major(majors, "CS", CS, "");
build_major(majors, "MechE", mech, "");
build_major(majors, "Finance", finance, "")
build_major(majors, "Botany", botany, "")
write_majors(majors);
