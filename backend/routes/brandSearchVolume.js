// var express = require('express');
// var router = express.Router();
// var brandSearchVolumeController = require('../controller/brandSearchVolumeController');

// /* GET home page. */
// router.get('/brandSearchVolume', function(req, res, next) {
//   // res.render('index', { title: 'Express' });
//   brandSearchVolumeController.brandSearchVolumeController(req, res, next);
// });

// module.exports = router;


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