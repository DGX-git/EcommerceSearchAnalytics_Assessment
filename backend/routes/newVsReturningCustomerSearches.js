var express = require('express');
var router = express.Router();
var newVsReturningCustomerSearchesController = require('../controller/newVsReturningCustomerSearchesController');
var cors = require('cors');

router.use(cors());

/* GET new vs returning customer searches. */
router.get('/newVsReturningCustomerSearches', function(req, res, next) {
  newVsReturningCustomerSearchesController.newVsReturningCustomerSearchesController(req, res, next);
});

module.exports = router;