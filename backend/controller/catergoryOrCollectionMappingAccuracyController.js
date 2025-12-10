// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const categoryOrCollectionMappingAccuracyController = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {categoryOrCollectionMappingAccuracyController};


var express = require('express');
var router = express.Router();
var categoryOrCollectionMappingAccuracyService = require('../service/catergoryOrCollectionMappingAccuracyService');

const categoryOrCollectionMappingAccuracyController = (req, res) => {
    categoryOrCollectionMappingAccuracyService.categoryOrCollectionMappingAccuracyService(req, res);
}

module.exports = { categoryOrCollectionMappingAccuracyController };