var express = require('express');
var router = express.Router();
var crossSearchPatternsController = require('../controller/crossSearchPatternsController');
var cors = require('cors');

router.use(cors());

router.get('/crossSearchPatterns', function(req, res, next) {
  crossSearchPatternsController.crossSearchPatternsController(req, res, next);
});

module.exports = router;