var express = require('express');
var router = express.Router();
var synonymMissesController = require('../controller/synonymMissesController');
var cors = require('cors');

router.use(cors());

router.get('/synonymMisses', function(req, res, next) {
  synonymMissesController.synonymMissesController(req, res, next);
});

module.exports = router;