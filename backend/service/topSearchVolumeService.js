var express = require('express');
var router = express.Router();
// var userservice = require('../service/userservice');
var sequelize = require('../config/sequelize.config');

/* GET users listing. */
// const topSearchVolumeService = (req, res) => {
//     // userservice.getUsers();
    
// }

const topSearchVolumeService = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            let topSearchVolumeService = await sequelize.query(`SELECT * FROM searches LIMIT 20`);
            response.status(200).json(topSearchVolumeService);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}

module.exports = {topSearchVolumeService};