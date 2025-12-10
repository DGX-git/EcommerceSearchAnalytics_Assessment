var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const attributeTrendsService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Define the special attributes we want to track
        const specialAttributes = ['vegan', 'SPF', 'acne-safe', 'cruelty-free', 'organic', 'natural', 'hypoallergenic', 'fragrance-free'];
        
        // Build dynamic SQL to count searches for each attribute
        const attributeCounts = await sequelize.query(`
            SELECT 
                'vegan' as attribute,
                COUNT(DISTINCT search_id) as trend_value
            FROM searches
            WHERE LOWER(attributes) LIKE '%vegan%'
            AND attributes IS NOT NULL
            
            UNION ALL
            
            SELECT 
                'SPF' as attribute,
                COUNT(DISTINCT search_id) as trend_value
            FROM searches
            WHERE LOWER(attributes) LIKE '%spf%'
            AND attributes IS NOT NULL
            
            UNION ALL
            
            SELECT 
                'acne-safe' as attribute,
                COUNT(DISTINCT search_id) as trend_value
            FROM searches
            WHERE LOWER(attributes) LIKE '%acne%'
            AND attributes IS NOT NULL
            
            UNION ALL
            
            SELECT 
                'cruelty-free' as attribute,
                COUNT(DISTINCT search_id) as trend_value
            FROM searches
            WHERE LOWER(attributes) LIKE '%cruelty-free%'
            AND attributes IS NOT NULL
            
            UNION ALL
            
            SELECT 
                'organic' as attribute,
                COUNT(DISTINCT search_id) as trend_value
            FROM searches
            WHERE LOWER(attributes) LIKE '%organic%'
            AND attributes IS NOT NULL
            
            UNION ALL
            
            SELECT 
                'natural' as attribute,
                COUNT(DISTINCT search_id) as trend_value
            FROM searches
            WHERE LOWER(attributes) LIKE '%natural%'
            AND attributes IS NOT NULL
            
            UNION ALL
            
            SELECT 
                'hypoallergenic' as attribute,
                COUNT(DISTINCT search_id) as trend_value
            FROM searches
            WHERE LOWER(attributes) LIKE '%hypoallergenic%'
            AND attributes IS NOT NULL
            
            UNION ALL
            
            SELECT 
                'fragrance-free' as attribute,
                COUNT(DISTINCT search_id) as trend_value
            FROM searches
            WHERE LOWER(attributes) LIKE '%fragrance-free%'
            AND attributes IS NOT NULL
            
            ORDER BY trend_value DESC
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(attributeCounts);
    } catch (error) {
        console.log('Failed to fetch attribute trends', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { attributeTrendsService };