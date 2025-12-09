var express = require('express');
var router = express.Router();
var topSearchVolumeController = require('../controller/topSearchVolumeController');
var cors = require('cors');

router.use(cors());

/* GET home page. */
router.get('/topSearchVolume', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  topSearchVolumeController.topSearchVolumeController(req, res, next);
});

module.exports = router;
