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