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
var searchFailRateService = require('../service/searchFailRateService');

/* GET search fail rate. */
const searchFailRateController = (req, res) => {
    searchFailRateService.searchFailRateService(req, res);
}

module.exports = { searchFailRateController };