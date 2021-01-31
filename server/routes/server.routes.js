const controller = require('../controllers/server.controller.js'),
    express = require('express'), 
    router = express.Router()
  
router.route('/getCourseInfo/:courseCode')
.get(controller.getCourseInfo);

/* Database operations */
router.route('/testDB')
.get(controller.testDB);

router.route('/getReqs/:major')
.get(controller.getReqs);


module.exports = router;