import axios from 'axios';

async function __getCourseInfo(course_code) {
    const url = `https://one.ufl.edu/apix/soc/schedule/?category=CWSP&term=2211&course_code&course-code=${course_code}`;

    const response = await axios.get(url);
    return response.data;
}

export default __getCourseInfo;