// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const brandSearchVolumeController = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {brandSearchVolumeController};



var express = require('express');
var router = express.Router();
var brandSearchVolumeService = require('../service/brandSearchVolumeService');

/* GET brand search volume. */
const brandSearchVolumeController = (req, res) => {
    brandSearchVolumeService.brandSearchVolumeService(req, res);
}

module.exports = { brandSearchVolumeController };