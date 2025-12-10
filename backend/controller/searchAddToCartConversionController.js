// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const usercontroller = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {usercontroller};


var express = require('express');
var router = express.Router();
var searchAddToCartConversionService = require('../service/searchAddToCartConversionService');

/* GET search add to cart conversion. */
const searchAddToCartConversionController = (req, res) => {
    searchAddToCartConversionService.searchAddToCartConversionService(req, res);
}

module.exports = { searchAddToCartConversionController };