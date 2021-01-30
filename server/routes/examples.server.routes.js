const examples = require('../controllers/examples.server.controller.js'),
    express = require('express'), 
    router = express.Router()
  
router.route('/getCourseInfo/:courseCode')
.get(examples.getCourseInfo);

module.exports = router;