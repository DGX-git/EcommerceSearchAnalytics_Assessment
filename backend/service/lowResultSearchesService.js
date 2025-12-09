var express = require('express');
var router = express.Router();
var userservice = require('../service/userservice');

/* GET users listing. */
const lowResultSearchService = (req, res) => {
    userservice.getUsers();
}

module.exports = {lowResultSearchService};