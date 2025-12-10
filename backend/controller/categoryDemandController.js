var express = require('express');
var router = express.Router();
var categoryDemandService = require('../service/categoryDemandService');

/* GET category demand with validation and error handling. */
const categoryDemandController = async (req, res) => {
    try {
        // Validate period parameter if provided
        const validPeriods = ['day', 'week', 'month', 'year'];
        if (req.query.period && !validPeriods.includes(req.query.period.toLowerCase())) {
            return res.status(400).json({ 
                error: `Invalid period parameter. Must be one of: ${validPeriods.join(', ')}` 
            });
        }

        // Validate limit parameter
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 50)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be between 1 and 50.' 
            });
        }

        await categoryDemandService.categoryDemandService(req, res);
        
    } catch (error) {
        console.error('Error in categoryDemandController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching category demand.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { categoryDemandController };