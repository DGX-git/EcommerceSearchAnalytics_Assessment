var express = require('express');
var router = express.Router();
var searchFailRateService = require('../service/searchFailRateService');

/* GET search fail rate with validation and error handling. */
const searchFailRateController = async (req, res) => {
    try {
        // Validate date range
        if (req.query.startDate && isNaN(Date.parse(req.query.startDate))) {
            return res.status(400).json({ 
                error: 'Invalid startDate format. Use ISO 8601 format.' 
            });
        }

        if (req.query.endDate && isNaN(Date.parse(req.query.endDate))) {
            return res.status(400).json({ 
                error: 'Invalid endDate format. Use ISO 8601 format.' 
            });
        }

        // Validate threshold parameter
        if (req.query.threshold && (isNaN(req.query.threshold) || req.query.threshold < 0 || req.query.threshold > 100)) {
            return res.status(400).json({ 
                error: 'Invalid threshold parameter. Must be between 0 and 100.' 
            });
        }

        await searchFailRateService.searchFailRateService(req, res);
        
    } catch (error) {
        console.error('Error in searchFailRateController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching search fail rate.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { searchFailRateController };