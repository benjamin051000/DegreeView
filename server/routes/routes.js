import * as controller from '../controllers/controller.js';
import express from 'express';

const router = express.Router();

/**
 * This can be used when a student selects a node 
 * in the graph to view course information about that
 * course code (if the info isn't already there).
 */
// router.route('/getCourseInfo/:courseCode')
//     .get(controller.getCourseInfo);

/* Database operations */
router.route('/getReqs/:major')
    .get(controller.retrieveRequirements);

router.route('/buildsemester/:major')
    .post(controller.build_semester);

router.route('/testDB')
    .get(controller.testDB);

export default router;