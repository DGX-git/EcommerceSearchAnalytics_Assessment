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
var synonymMissesService = require('../service/synonymMissesService');

const synonymMissesController = (req, res) => {
    synonymMissesService.synonymMissesService(req, res);
}

module.exports = { synonymMissesController };