// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/lowResultSearches', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;


var express = require('express');
var router = express.Router();
var lowResultSearchesController = require('../controller/lowResultSearchesController');
var cors = require('cors');

router.use(cors());

/* GET low result searches. */
router.get('/lowResultSearches', function(req, res, next) {
  lowResultSearchesController.lowResultSearchesController(req, res, next);
});

module.exports = router;