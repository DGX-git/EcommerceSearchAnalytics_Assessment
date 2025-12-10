var express = require('express');
var router = express.Router();
var conversionIntentFunnelController = require('../controller/conversionIntentFunnelController');
var cors = require('cors');

router.use(cors());

router.get('/conversionIntentFunnel', function(req, res, next) {
  conversionIntentFunnelController.conversionIntentFunnelController(req, res, next);
});

module.exports = router;