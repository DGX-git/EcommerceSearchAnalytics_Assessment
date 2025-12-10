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
var lowResultSearchService = require('../service/lowResultSearchesService');

/* GET low result searches. */
const lowResultSearchesController = (req, res) => {
    lowResultSearchService.lowResultSearchService(req, res);
}

module.exports = { lowResultSearchesController };