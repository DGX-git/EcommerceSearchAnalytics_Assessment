// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/categoryOrCollectionMappingAccuracy', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;


var express = require('express');
var router = express.Router();
var categoryOrCollectionMappingAccuracyController = require('../controller/catergoryOrCollectionMappingAccuracyController');
var cors = require('cors');

router.use(cors());

router.get('/catergoryOrCollectionMappingAccuracy', function(req, res, next) {
  categoryOrCollectionMappingAccuracyController.categoryOrCollectionMappingAccuracyController(req, res, next);
});

module.exports = router;