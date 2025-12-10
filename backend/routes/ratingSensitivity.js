// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/ratingSensitivity', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;



var express = require('express');
var router = express.Router();
var ratingSensitivityController = require('../controller/ratingSensitivityController');
var cors = require('cors');

router.use(cors());

/* GET rating sensitivity. */
router.get('/ratingSensitivity', function(req, res, next) {
  ratingSensitivityController.ratingSensitivityController(req, res, next);
});

module.exports = router;