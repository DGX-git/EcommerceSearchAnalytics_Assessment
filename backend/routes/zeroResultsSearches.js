var express = require('express');
var router = express.Router();
var zeroResultsSearchesController = require('../controller/zeroResultsSearchesController');
var cors = require('cors');

router.use(cors());

/* GET zero results searches. */
router.get('/zeroResultsSearches', function(req, res, next) {
  zeroResultsSearchesController.zeroResultsSearchesController(req, res, next);
});

module.exports = router;