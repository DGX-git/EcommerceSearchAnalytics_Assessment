var express = require('express');
var router = express.Router();
var crossSearchPatternsService = require('../service/crossSearchPatternsService');

/* GET cross search patterns with validation and error handling. */
const crossSearchPatternsController = async (req, res) => {
    try {
        // Validate minimum correlation threshold
        if (req.query.minCorrelation && (isNaN(req.query.minCorrelation) || req.query.minCorrelation < 0 || req.query.minCorrelation > 1)) {
            return res.status(400).json({ 
                error: 'Invalid minCorrelation parameter. Must be between 0 and 1.' 
            });
        }

        // Validate limit parameter
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 100)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be between 1 and 100.' 
            });
        }

        await crossSearchPatternsService.crossSearchPatternsService(req, res);
        
    } catch (error) {
        console.error('Error in crossSearchPatternsController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching cross search patterns.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { crossSearchPatternsController };