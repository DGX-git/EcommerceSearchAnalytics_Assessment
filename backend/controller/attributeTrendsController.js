var express = require('express');
var router = express.Router();
var userservice = require('../service/userservice');

/* GET users listing. */
const attributeTrendsController = (req, res, next) => {
    userservice.getUsers();
}

module.exports = {attributeTrendsController};