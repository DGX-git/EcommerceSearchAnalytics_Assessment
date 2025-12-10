var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const zeroResultsSearchesService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to get keywords that returned zero results
        const zeroResultsSearches = await sequelize.query(`
            SELECT 
                search_keyword as keyword,
                COUNT(*) as count
            FROM searches
            WHERE total_results = 0
            AND search_keyword IS NOT NULL
            AND search_keyword != ''
            GROUP BY search_keyword
            ORDER BY count DESC
            LIMIT 20
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(zeroResultsSearches);
    } catch (error) {
        console.log('Failed to fetch zero results searches', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { zeroResultsSearchesService };