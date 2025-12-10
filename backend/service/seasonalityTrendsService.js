var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const seasonalityTrendsService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to get seasonality trends - search volume by month/season
        const seasonalityTrends = await sequelize.query(`
            SELECT 
                CASE 
                    WHEN EXTRACT(MONTH FROM s.search_date) IN (12, 1, 2) THEN 'Winter'
                    WHEN EXTRACT(MONTH FROM s.search_date) IN (3, 4, 5) THEN 'Spring'
                    WHEN EXTRACT(MONTH FROM s.search_date) IN (6, 7, 8) THEN 'Summer'
                    WHEN EXTRACT(MONTH FROM s.search_date) IN (9, 10, 11) THEN 'Fall'
                    ELSE 'Unknown'
                END as season,
                TO_CHAR(s.search_date, 'YYYY-MM') as month,
                COUNT(DISTINCT s.search_id) as search_volume,
                COUNT(DISTINCT s.customer_id) as unique_customers,
                ROUND(AVG(s.total_results), 2) as avg_results,
                ROUND(AVG(s.max_rating), 2) as avg_rating
            FROM searches s
            WHERE s.search_date IS NOT NULL
            GROUP BY season, month
            ORDER BY month DESC
            LIMIT 24
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(seasonalityTrends);
    } catch (error) {
        console.log('Failed to fetch seasonality trends', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { seasonalityTrendsService };