var express = require('express');
var router = express.Router();
var categoryDemandController = require('../controller/categoryDemandController');
var cors = require('cors');

router.use(cors());

/* GET category demand. */
router.get('/categoryDemand', function(req, res, next) {
  categoryDemandController.categoryDemandController(req, res, next);
});

module.exports = router;