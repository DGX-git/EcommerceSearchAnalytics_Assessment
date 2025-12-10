var express = require('express');
var router = express.Router();
var searchAddToCartConversionController = require('../controller/searchAddToCartConversionController');
var cors = require('cors');

router.use(cors());

/* GET search add to cart conversion. */
router.get('/searchAddToCartConversion', function(req, res, next) {
  searchAddToCartConversionController.searchAddToCartConversionController(req, res, next);
});

module.exports = router;