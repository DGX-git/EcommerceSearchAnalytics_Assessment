var express = require('express');
var router = express.Router();
var topSearchVolumeService = require('../service/topSearchVolumeService');

/* GET users listing. */
const topSearchVolumeController = (req, res) => {
    // userservice.getUsers();
    topSearchVolumeService.topSearchVolumeService(req, res);
}

module.exports = {topSearchVolumeController};