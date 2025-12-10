// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const brandSearchVolumeService = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {brandSearchVolumeService};


var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const brandSearchVolumeService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to get search volume grouped by brand
        const brandSearchVolume = await sequelize.query(`
            SELECT 
                b.brand_name as brands,
                COUNT(DISTINCT sb.search_id) as search_volume
            FROM search_brands sb
            JOIN brands b ON sb.brand_id = b.brand_id
            GROUP BY b.brand_id, b.brand_name
            ORDER BY search_volume DESC
            LIMIT 20
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(brandSearchVolume);
    } catch (error) {
        console.log('Failed to fetch brand search volume', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { brandSearchVolumeService };