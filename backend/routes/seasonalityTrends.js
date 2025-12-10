// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/seasonalityTrends', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;


var express = require('express');
var router = express.Router();
var seasonalityTrendsController = require('../controller/seasonalityTrendsController');
var cors = require('cors');

router.use(cors());

/* GET seasonality trends. */
router.get('/seasonalityTrends', function(req, res, next) {
  seasonalityTrendsController.seasonalityTrendsController(req, res, next);
});

module.exports = router;