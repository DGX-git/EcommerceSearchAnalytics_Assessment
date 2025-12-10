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
var highExitSearchesService = require('../service/highExitSearchesService');

/* GET high exit searches. */
const highExitSearchesController = (req, res) => {
    highExitSearchesService.highExitSearchService(req, res);
}

module.exports = { highExitSearchesController };