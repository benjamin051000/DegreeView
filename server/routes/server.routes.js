import * as controller from '../controllers/controller.js';
import express from 'express';

const router = express.Router();

router.route('/getCourseInfo/:courseCode')
.get(controller.getCourseInfo);

/* Database operations */
router.route('/testDB')
.get(controller.testDB);

router.route('/getReqs/:major')
.get(controller.retrieveRequirements);

router.route('/buildsemester/:major')
.post(controller.build_semester);



export default router;