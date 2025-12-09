var express = require('express');
var router = express.Router();
var brandSearchVolumeController = require('../controller/brandSearchVolumeController');

/* GET home page. */
router.get('/brandSearchVolume', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  brandSearchVolumeController.brandSearchVolumeController(req, res, next);
});

module.exports = router;
