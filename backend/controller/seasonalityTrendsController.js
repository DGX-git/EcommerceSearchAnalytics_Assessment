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
var seasonalityTrendsService = require('../service/seasonalityTrendsService');

/* GET seasonality trends. */
const seasonalityTrendsController = (req, res) => {
    seasonalityTrendsService.seasonalityTrendsService(req, res);
}

module.exports = { seasonalityTrendsController };