var express = require('express');
var router = express.Router();
var brandSearchVolumeController = require('../controller/brandSearchVolumeController');
var cors = require('cors');

router.use(cors());

/* GET brand search volume. */
router.get('/brandSearchVolume', function(req, res, next) {
  brandSearchVolumeController.brandSearchVolumeController(req, res, next);
});

module.exports = router;