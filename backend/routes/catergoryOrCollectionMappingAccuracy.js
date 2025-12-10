var express = require('express');
var router = express.Router();
var categoryOrCollectionMappingAccuracyController = require('../controller/catergoryOrCollectionMappingAccuracyController');
var cors = require('cors');

router.use(cors());

router.get('/catergoryOrCollectionMappingAccuracy', function(req, res, next) {
  categoryOrCollectionMappingAccuracyController.categoryOrCollectionMappingAccuracyController(req, res, next);
});

module.exports = router;