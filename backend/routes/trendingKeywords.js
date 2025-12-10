// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/trendingKeyword', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;


var express = require('express');
var router = express.Router();
var trendingKeywordController = require('../controller/trendingkeywordsController');
var cors = require('cors');

router.use(cors());

/* GET trending keywords. */
router.get('/trendingKeywords', function(req, res, next) {
  trendingKeywordController.trendingKeywordController(req, res, next);
});

module.exports = router;