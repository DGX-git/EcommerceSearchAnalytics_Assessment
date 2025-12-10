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
var trendingKeywordService = require('../service/trendingkeywordsService');

/* GET trending keywords. */
const trendingKeywordController = (req, res) => {
    trendingKeywordService.trendingKeywordService(req, res);
}

module.exports = { trendingKeywordController };