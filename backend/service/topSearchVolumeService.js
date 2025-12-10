// var express = require('express');
// var router = express.Router();
// // var userservice = require('../service/userservice');
// var sequelize = require('../config/sequelize.config');

// /* GET users listing. */
// // const topSearchVolumeService = (req, res) => {
// //     // userservice.getUsers();
    
// // }

// const topSearchVolumeService = async(request, response) => {
//     sequelize.sync()
//         .then(async () => {
//             let topSearchVolumeService = await sequelize.query(`SELECT * FROM searches LIMIT 20`);
//             response.status(200).json(topSearchVolumeService);
//         })
//         .catch((error) => console.log('Failed to synchronize with the database', error));
// }

// module.exports = {topSearchVolumeService};



// var express = require('express');
// var router = express.Router();
// var sequelize = require('../config/sequelize.config');
// var { Op } = require('sequelize');

// const topSearchVolumeService = async(request, response) => {
//     try {
//         await sequelize.sync();
        
//         // Get current date and calculate the start of the week (last 7 days)
//         const currentDate = new Date();
//         const startOfWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        
//         // Query to get top search keywords grouped by search_keyword with their count for the past week
//         const topSearchVolume = await sequelize.query(`
//             SELECT 
//                 search_keyword as keyword,
//                 COUNT(*) as search_volume
//             FROM searches
//             WHERE search_date >= :startOfWeek
//             GROUP BY search_keyword
//             ORDER BY search_volume DESC
//             LIMIT 20
//         `, {
//             replacements: { startOfWeek: startOfWeek },
//             type: sequelize.QueryTypes.SELECT
//         });
        
//         response.status(200).json(topSearchVolume);
//     } catch (error) {
//         console.log('Failed to fetch top search volume', error);
//         response.status(500).json({ error: 'Failed to fetch data' });
//     }
// }

// module.exports = { topSearchVolumeService };





var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');
var { Op } = require('sequelize');

const topSearchVolumeService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Get current date and calculate the start of the week (last 7 days)
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Query to get top search keywords grouped by search_keyword with their count for the past week
        const result = await sequelize.query(`
            SELECT 
                search_keyword as keyword,
                COUNT(*) as search_volume
            FROM searches
            WHERE search_date >= :startOfWeek
            AND search_keyword IS NOT NULL
            AND search_keyword != ''
            GROUP BY search_keyword
            ORDER BY search_volume DESC
            LIMIT 20
        `, {
            replacements: { startOfWeek: startOfWeek },
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(result);
    } catch (error) {
        console.log('Failed to fetch top search volume', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { topSearchVolumeService };