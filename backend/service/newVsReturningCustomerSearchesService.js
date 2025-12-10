var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const newVsReturningCustomerSearchesService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to categorize customers as new or returning based on search frequency
        // New customers: 1-2 searches
        // Returning customers: 3+ searches
        
        const customerSearches = await sequelize.query(`
            SELECT 
                CASE 
                    WHEN search_count <= 2 THEN 'New Customers'
                    ELSE 'Returning Customers'
                END as customer_type,
                COUNT(DISTINCT customer_id) as unique_customers,
                SUM(search_count) as total_searches,
                ROUND(AVG(search_count), 2) as avg_searches_per_customer,
                ROUND(AVG(avg_rating), 2) as avg_rating,
                ROUND(AVG(avg_results), 2) as avg_results
            FROM (
                SELECT 
                    s.customer_id,
                    COUNT(DISTINCT s.search_id) as search_count,
                    ROUND(AVG(s.max_rating), 2) as avg_rating,
                    ROUND(AVG(s.total_results), 2) as avg_results
                FROM searches s
                WHERE s.customer_id IS NOT NULL
                GROUP BY s.customer_id
            ) customer_stats
            GROUP BY customer_type
            ORDER BY total_searches DESC
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(customerSearches);
    } catch (error) {
        console.log('Failed to fetch new vs returning customer searches', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { newVsReturningCustomerSearchesService };