// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/searchFailRate', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;


var express = require('express');
var router = express.Router();
var searchFailRateController = require('../controller/searchFailRateController');
var cors = require('cors');

router.use(cors());

/* GET search fail rate. */
router.get('/searchFailRate', function(req, res, next) {
  searchFailRateController.searchFailRateController(req, res, next);
});

module.exports = router;