// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const categoryDemandController = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {categoryDemandController};



var express = require('express');
var router = express.Router();
var categoryDemandService = require('../service/categoryDemandService');

/* GET category demand. */
const categoryDemandController = (req, res) => {
    categoryDemandService.categoryDemandService(req, res);
}

module.exports = { categoryDemandController };