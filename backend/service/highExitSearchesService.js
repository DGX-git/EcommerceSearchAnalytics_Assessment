var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const highExitSearchService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to identify high-exit searches
        // High-exit searches are those where:
        // 1. The search returns very few or zero results, OR
        // 2. The same customer doesn't make another search within 1 hour (indicating dissatisfaction)
        
        const highExitSearches = await sequelize.query(`
            SELECT 
                s.search_keyword as keyword,
                COUNT(DISTINCT s.search_id) as total_searches,
                COUNT(DISTINCT CASE 
                    WHEN s.total_results = 0 THEN 1 
                    ELSE NULL 
                END) as zero_result_searches,
                COUNT(DISTINCT CASE 
                    WHEN s.total_results > 0 AND s.total_results < 5 THEN 1 
                    ELSE NULL 
                END) as low_result_searches,
                ROUND(
                    (COUNT(DISTINCT CASE 
                        WHEN s.total_results = 0 THEN 1 
                        ELSE NULL 
                    END) + COUNT(DISTINCT CASE 
                        WHEN s.total_results > 0 AND s.total_results < 5 THEN 1 
                        ELSE NULL 
                    END)) * 100.0 / COUNT(DISTINCT s.search_id), 
                    2
                ) as exit_rate
            FROM searches s
            WHERE s.search_keyword IS NOT NULL
            AND s.search_keyword != ''
            GROUP BY s.search_keyword
            HAVING COUNT(DISTINCT s.search_id) > 0
            ORDER BY exit_rate DESC
            LIMIT 20
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(highExitSearches);
    } catch (error) {
        console.log('Failed to fetch high exit searches', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { highExitSearchService };