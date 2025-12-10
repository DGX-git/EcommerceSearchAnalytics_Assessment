var express = require('express');
var router = express.Router();
var searchByLocationOrRegionController = require('../controller/searchByLocationOrRegionController');
var cors = require('cors');

router.use(cors());

/* GET search by location or region. */
router.get('/searchByLocationOrRegion', function(req, res, next) {
  searchByLocationOrRegionController.searchByLocationOrRegionController(req, res, next);
});

module.exports = router;