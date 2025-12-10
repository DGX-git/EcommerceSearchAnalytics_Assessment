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
var zeroResultsSearchesService = require('../service/zeroResultsSearchesService');

/* GET zero results searches. */
const zeroResultsSearchesController = (req, res) => {
    zeroResultsSearchesService.zeroResultsSearchesService(req, res);
}

module.exports = { zeroResultsSearchesController };