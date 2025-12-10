// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const ratingSensitivityService = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {ratingSensitivityService};


var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const ratingSensitivityService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to categorize searches by rating sensitivity
        // Low: max_rating <= 2 (users not sensitive to ratings)
        // Medium: max_rating 3-4 (moderate rating sensitivity)
        // High: max_rating >= 5 (highly rating-sensitive searches)
        const ratingSensitivity = await sequelize.query(`
            SELECT 
                CASE 
                    WHEN max_rating <= 2 THEN 'Low (≤2 stars)'
                    WHEN max_rating > 2 AND max_rating < 5 THEN 'Medium (3-4 stars)'
                    WHEN max_rating >= 5 THEN 'High (5 stars)'
                    ELSE 'Not Specified'
                END as rating_range,
                COUNT(DISTINCT search_id) as search_count,
                ROUND(AVG(max_rating), 2) as avg_rating,
                ROUND(COUNT(DISTINCT search_id) * 100.0 / (SELECT COUNT(DISTINCT search_id) FROM searches WHERE max_rating IS NOT NULL AND max_rating > 0), 2) as percentage
            FROM searches
            WHERE max_rating IS NOT NULL AND max_rating >= 0
            GROUP BY rating_range
            ORDER BY 
                CASE 
                    WHEN rating_range = 'Low (≤2 stars)' THEN 1
                    WHEN rating_range = 'Medium (3-4 stars)' THEN 2
                    WHEN rating_range = 'High (5 stars)' THEN 3
                    ELSE 4
                END
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(ratingSensitivity);
    } catch (error) {
        console.log('Failed to fetch rating sensitivity', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { ratingSensitivityService };