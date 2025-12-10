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
var keywordClusteringService = require('../service/keywordClusteringService');

/* GET keyword clustering. */
const keywordClusteringController = (req, res) => {
    keywordClusteringService.keywordClusteringService(req, res);
}

module.exports = { keywordClusteringController };