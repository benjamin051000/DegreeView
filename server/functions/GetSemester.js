import get_course from '../functions/GetCourseInfo.js';
// This is the same as "import {default as get_course} from ...";


function parse_req(pre_str) {
    if (pre_str == undefined) {
        return []
    }

    const reg = /(( or )?([A-Z][A-Z][A-Z]\s\d\d\d\d\w?))+/g;
    let prereq = pre_str.match(reg)

    if (!prereq) {
        return []
    }

    for (var i = 0; i < prereq.length; i++) {
        prereq[i] = prereq[i].replace(/ or /g, ",");
        prereq[i] = prereq[i].replace(/ /g, "");
    }
    return prereq;
}

async function process_course(course_code) {
    let course_info = await get_course(course_code);
    var remove = ["AP credit for MAC 2311", "with a minimum grade of C", "(", ") ", "or a passing score on Chem placement plus no attempt of CHM 1025 w/grade <C or W, and MAC 1147, or MAC 1140 plus MAC 1114, or higher MAC course with a minimum grade of C.", "or (MAC 1140 and MAC 1114or MAC 23##)"]

    var course = course_info[0]["COURSES"][0];
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
        let coreq = eligible[i]['coreq']
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
const runFlow = function (major, takenClasses, reqs) {
    // TODO These are just placeholders for now 

    console.log(`>>>\tRunning flow with major: "${major}" and taken classes:`, takenClasses);
    console.log('Requirements received:', reqs);

    console.log('Building semester...');

    let semester = __build_semester(reqs, takenClasses);

    console.log('Semester built.');

    // console.log('>>>\tSemester:', semester);

    return semester;
}

export {
    parse_req,
    process_course,
    get_eligible_courses,
    check_coreq,
    __build_semester,
    full_schedule,
    remove_req,
    runFlow
};