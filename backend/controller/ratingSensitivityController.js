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
var ratingSensitivityService = require('../service/ratingSensitivityService');

/* GET rating sensitivity. */
const ratingSensitivityController = (req, res) => {
    ratingSensitivityService.ratingSensitivityService(req, res);
}

module.exports = { ratingSensitivityController };