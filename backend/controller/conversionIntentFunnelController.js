// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const conversionIntentFunnelController = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {conversionIntentFunnelController};


var express = require('express');
var router = express.Router();
var conversionIntentFunnelService = require('../service/conversionIntentFunnelService');

const conversionIntentFunnelController = (req, res) => {
    conversionIntentFunnelService.conversionIntentFunnelService(req, res);
}

module.exports = { conversionIntentFunnelController };