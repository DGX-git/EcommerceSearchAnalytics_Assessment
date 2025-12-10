// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/highExitSearches', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;


var express = require('express');
var router = express.Router();
var highExitSearchesController = require('../controller/highExitSearchesController');
var cors = require('cors');

router.use(cors());

/* GET high exit searches. */
router.get('/highExitSearches', function(req, res, next) {
  highExitSearchesController.highExitSearchesController(req, res, next);
});

module.exports = router;