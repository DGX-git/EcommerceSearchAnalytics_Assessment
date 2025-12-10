// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/priceIntentSegment', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;


var express = require('express');
var router = express.Router();
var priceIntentSegmentsController = require('../controller/priceIntentSegmentsController');
var cors = require('cors');

router.use(cors());

/* GET price intent segments. */
router.get('/priceIntentSegments', function(req, res, next) {
  priceIntentSegmentsController.priceIntentSegmentsController(req, res, next);
});

module.exports = router;