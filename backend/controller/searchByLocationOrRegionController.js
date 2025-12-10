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
var searchByLocationOrRegionService = require('../service/searchByLocationOrRegionService');

/* GET search by location or region. */
const searchByLocationOrRegionController = (req, res) => {
    searchByLocationOrRegionService.searchByLocationOrRegionService(req, res);
}

module.exports = { searchByLocationOrRegionController };