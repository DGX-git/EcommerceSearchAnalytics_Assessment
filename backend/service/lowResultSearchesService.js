// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const lowResultSearchService = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {lowResultSearchService};




var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const lowResultSearchService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to get keywords that returned very few results (less than 5)
        const lowResultSearches = await sequelize.query(`
            SELECT 
                search_keyword as keyword,
                AVG(total_results) as avg_result_count,
                COUNT(*) as search_count,
                MIN(total_results) as min_results,
                MAX(total_results) as max_results
            FROM searches
            WHERE search_keyword IS NOT NULL
            AND search_keyword != ''
            GROUP BY search_keyword
            HAVING AVG(total_results) < 5
            ORDER BY avg_result_count ASC
            LIMIT 20
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(lowResultSearches);
    } catch (error) {
        console.log('Failed to fetch low result searches', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { lowResultSearchService };