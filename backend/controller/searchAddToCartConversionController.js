var express = require('express');
var router = express.Router();
var searchAddToCartConversionService = require('../service/searchAddToCartConversionService');

/* GET search add to cart conversion with validation and error handling. */
const searchAddToCartConversionController = async (req, res) => {
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

        // Validate minimum conversion rate filter
        if (req.query.minConversionRate && (isNaN(req.query.minConversionRate) || req.query.minConversionRate < 0 || req.query.minConversionRate > 100)) {
            return res.status(400).json({ 
                error: 'Invalid minConversionRate parameter. Must be between 0 and 100.' 
            });
        }

        await searchAddToCartConversionService.searchAddToCartConversionService(req, res);
        
    } catch (error) {
        console.error('Error in searchAddToCartConversionController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching conversion data.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { searchAddToCartConversionController };