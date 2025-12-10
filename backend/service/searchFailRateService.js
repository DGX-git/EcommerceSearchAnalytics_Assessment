var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const searchFailRateService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to calculate search fail rate
        // A search is considered a "fail" if:
        // 1. It returned zero results, OR
        // 2. It returned results but had very low ratings (< 3), OR
        // 3. It returned very few results (< 2)
        
        const failRateData = await sequelize.query(`
            SELECT 
                s.search_keyword as keyword,
                COUNT(DISTINCT s.search_id) as total_searches,
                COUNT(DISTINCT CASE 
                    WHEN s.total_results = 0 
                    OR s.total_results < 2 
                    OR (s.total_results > 0 AND s.max_rating < 3)
                    THEN s.search_id 
                    ELSE NULL 
                END) as failed_searches,
                ROUND(
                    (COUNT(DISTINCT CASE 
                        WHEN s.total_results = 0 
                        OR s.total_results < 2 
                        OR (s.total_results > 0 AND s.max_rating < 3)
                        THEN s.search_id 
                        ELSE NULL 
                    END) * 100.0 / COUNT(DISTINCT s.search_id)),
                    2
                ) as fail_rate,
                COUNT(DISTINCT CASE WHEN s.total_results = 0 THEN s.search_id ELSE NULL END) as zero_result_count,
                COUNT(DISTINCT CASE WHEN s.total_results > 0 AND s.total_results < 2 THEN s.search_id ELSE NULL END) as low_result_count,
                COUNT(DISTINCT CASE WHEN s.total_results > 0 AND s.max_rating < 3 THEN s.search_id ELSE NULL END) as low_rating_count
            FROM searches s
            WHERE s.search_keyword IS NOT NULL
            AND s.search_keyword != ''
            GROUP BY s.search_keyword
            HAVING COUNT(DISTINCT s.search_id) >= 2
            ORDER BY fail_rate DESC
            LIMIT 20
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(failRateData);
    } catch (error) {
        console.log('Failed to fetch search fail rate', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { searchFailRateService };