var express = require('express');
var router = express.Router();
var categoryDemandController = require('../controller/categoryDemandController');

/* GET home page. */
router.get('/categoryDemand', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  categoryDemandController.getCategoryDemand(req, res, next);
});

module.exports = router;
