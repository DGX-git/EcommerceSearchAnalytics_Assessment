var express = require('express');
var router = express.Router();
var userservice = require('../service/userservice');

/* GET users listing. */
const searchAddToCartConversion = (req, res) => {
    userservice.getUsers();
}

module.exports = {searchAddToCartConversion};