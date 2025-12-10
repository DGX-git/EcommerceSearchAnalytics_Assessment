var express = require('express');
var router = express.Router();
var keywordClusteringController = require('../controller/keywordClusteringController');
var cors = require('cors');

router.use(cors());

/* GET keyword clustering. */
router.get('/keywordClustering', function(req, res, next) {
  keywordClusteringController.keywordClusteringController(req, res, next);
});

module.exports = router;