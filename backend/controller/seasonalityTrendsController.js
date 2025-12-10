var express = require('express');
var router = express.Router();
var seasonalityTrendsService = require('../service/seasonalityTrendsService');

/* GET seasonality trends with validation and error handling. */
const seasonalityTrendsController = async (req, res) => {
    try {
        // Validate period type
        const validPeriods = ['daily', 'weekly', 'monthly', 'yearly'];
        if (req.query.period && !validPeriods.includes(req.query.period.toLowerCase())) {
            return res.status(400).json({ 
                error: `Invalid period parameter. Must be one of: ${validPeriods.join(', ')}` 
            });
        }

        // Validate year parameter
        if (req.query.year && (isNaN(req.query.year) || req.query.year < 2000 || req.query.year > new Date().getFullYear() + 1)) {
            return res.status(400).json({ 
                error: `Invalid year parameter. Must be between 2000 and ${new Date().getFullYear() + 1}.` 
            });
        }

        await seasonalityTrendsService.seasonalityTrendsService(req, res);
        
    } catch (error) {
        console.error('Error in seasonalityTrendsController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching seasonality trends.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { seasonalityTrendsController };