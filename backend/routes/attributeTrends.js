var express = require('express');
var router = express.Router();
var attributeTrendsController = require('../controller/attributeTrendsController');

/* GET home page. */
router.get('/attributeTrends', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  attributeTrendsController.attributeTrendsController(req, res, next);
});

module.exports = router;
