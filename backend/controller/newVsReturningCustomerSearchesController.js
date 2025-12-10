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
var newVsReturningCustomerSearchesService = require('../service/newVsReturningCustomerSearchesService');

/* GET new vs returning customer searches. */
const newVsReturningCustomerSearchesController = (req, res) => {
    newVsReturningCustomerSearchesService.newVsReturningCustomerSearchesService(req, res);
}

module.exports = { newVsReturningCustomerSearchesController };