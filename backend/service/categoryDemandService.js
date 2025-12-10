var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const categoryDemandService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to get category demand (search volume grouped by category)
        const categoryDemand = await sequelize.query(`
            SELECT 
                c.category_name as category,
                COUNT(DISTINCT sc.search_id) as demand
            FROM search_categories sc
            JOIN categories c ON sc.category_id = c.category_id
            GROUP BY c.category_id, c.category_name
            ORDER BY demand DESC
            LIMIT 20
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        response.status(200).json(categoryDemand);
    } catch (error) {
        console.log('Failed to fetch category demand', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { categoryDemandService };