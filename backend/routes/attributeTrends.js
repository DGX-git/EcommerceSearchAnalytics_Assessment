var express = require('express');
var router = express.Router();
var attributeTrendsController = require('../controller/attributeTrendsController');
var cors = require('cors');

router.use(cors());

/* GET attribute trends. */
router.get('/attributeTrends', function(req, res, next) {
  attributeTrendsController.attributeTrendsController(req, res, next);
});

module.exports = router;