// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const crosSearchPatternService = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {crosSearchPatternService};





var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const crossSearchPatternsService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to find search sequences: what keyword follows another keyword
        // This identifies patterns like "serum" -> "vitamin C"
        const searchPatterns = await sequelize.query(`
            WITH customer_searches AS (
                SELECT 
                    s1.customer_id,
                    s1.search_keyword as first_keyword,
                    s2.search_keyword as next_keyword,
                    s1.search_date as first_date,
                    s2.search_date as next_date,
                    ROW_NUMBER() OVER (PARTITION BY s1.customer_id ORDER BY s2.search_date) as search_sequence
                FROM searches s1
                INNER JOIN searches s2 
                    ON s1.customer_id = s2.customer_id
                    AND s2.search_date > s1.search_date
                    AND DATEDIFF(day, s1.search_date, s2.search_date) <= 7
                WHERE s1.search_keyword IS NOT NULL 
                AND s1.search_keyword != ''
                AND s2.search_keyword IS NOT NULL 
                AND s2.search_keyword != ''
                AND s1.search_keyword != s2.search_keyword
            )
            SELECT 
                CONCAT(first_keyword, ' → ', next_keyword) as pattern,
                COUNT(*) as frequency,
                COUNT(DISTINCT customer_id) as user_count,
                ROUND(COUNT(*) * 100.0 / 
                    (SELECT COUNT(*) FROM searches WHERE search_keyword IS NOT NULL AND search_keyword != ''), 2) as pattern_percentage
            FROM customer_searches
            WHERE search_sequence <= 2
            GROUP BY first_keyword, next_keyword
            HAVING COUNT(*) >= 2
            ORDER BY frequency DESC
            LIMIT 30
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(searchPatterns);
    } catch (error) {
        console.log('Failed to fetch cross search patterns', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { crossSearchPatternsService };