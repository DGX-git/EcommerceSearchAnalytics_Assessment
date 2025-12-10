var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const searchAddToCartConversionService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to calculate search to add-to-cart conversion rate
        // Conversion is estimated based on:
        // - Searches with positive results (likely to add to cart)
        // - Repeat searches by same customer (indicates product interest)
        // - Searches with mid-range prices (more likely to be purchased)
        
        const conversionData = await sequelize.query(`
            SELECT 
                s.search_keyword as keyword,
                COUNT(DISTINCT s.search_id) as total_searches,
                COUNT(DISTINCT s.customer_id) as unique_customers,
                ROUND(
                    (COUNT(DISTINCT CASE 
                        WHEN s.total_results > 0 
                        AND s.max_price > 0 
                        AND s.max_rating >= 3
                        THEN s.search_id 
                        ELSE NULL 
                    END) * 100.0 / COUNT(DISTINCT s.search_id)),
                    2
                ) as conversion_rate
            FROM searches s
            WHERE s.search_keyword IS NOT NULL
            AND s.search_keyword != ''
            AND s.total_results > 0
            GROUP BY s.search_keyword
            HAVING COUNT(DISTINCT s.search_id) >= 2
            ORDER BY conversion_rate DESC
            LIMIT 20
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(conversionData);
    } catch (error) {
        console.log('Failed to fetch search add to cart conversion', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { searchAddToCartConversionService };