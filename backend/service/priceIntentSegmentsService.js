// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const priceIntentSegmentService = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {priceIntentSegmentService};


var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const priceIntentSegmentService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to categorize searches by price intent
        // Budget: max_price <= 50
        // Mid-range: max_price 51-200
        // Premium: max_price > 200
        const priceIntentSegments = await sequelize.query(`
            SELECT 
                CASE 
                    WHEN max_price <= 50 THEN 'Budget (≤$50)'
                    WHEN max_price > 50 AND max_price <= 200 THEN 'Mid-range ($51-$200)'
                    ELSE 'Premium (>$200)'
                END as price_segment,
                COUNT(DISTINCT search_id) as segment_count,
                ROUND(AVG(max_price), 2) as avg_max_price,
                MIN(max_price) as min_price,
                MAX(max_price) as max_price
            FROM searches
            WHERE max_price > 0
            GROUP BY price_segment
            ORDER BY 
                CASE 
                    WHEN price_segment = 'Budget (≤$50)' THEN 1
                    WHEN price_segment = 'Mid-range ($51-$200)' THEN 2
                    ELSE 3
                END
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(priceIntentSegments);
    } catch (error) {
        console.log('Failed to fetch price intent segments', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { priceIntentSegmentService };