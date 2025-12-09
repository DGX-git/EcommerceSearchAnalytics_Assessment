var express = require('express');
var router = express.Router();
var userservice = require('../service/userservice');

/* GET users listing. */
const zeroResultSearchesService = (req, res) => {
    userservice.getUsers();
}

module.exports = {zeroResultSearchesService};