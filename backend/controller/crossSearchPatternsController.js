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
var crossSearchPatternsService = require('../service/crossSearchPatternsService');

const crossSearchPatternsController = (req, res) => {
    crossSearchPatternsService.crossSearchPatternsService(req, res);
}

module.exports = { crossSearchPatternsController };