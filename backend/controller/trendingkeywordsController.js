var express = require('express');
var router = express.Router();
var trendingKeywordService = require('../service/trendingkeywordsService');

/* GET trending keywords with validation and error handling. */
const trendingKeywordController = async (req, res) => {
    try {
        // Validate limit parameter
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 100)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be between 1 and 100.' 
            });
        }

        // Validate threshold parameter (minimum growth percentage)
        if (req.query.threshold && (isNaN(req.query.threshold) || req.query.threshold < 0)) {
            return res.status(400).json({ 
                error: 'Invalid threshold parameter. Must be a non-negative number.' 
            });
        }

        await trendingKeywordService.trendingKeywordService(req, res);
        
    } catch (error) {
        console.error('Error in trendingKeywordController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching trending keywords.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { trendingKeywordController };