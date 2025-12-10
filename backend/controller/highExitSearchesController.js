var express = require('express');
var router = express.Router();
var highExitSearchesService = require('../service/highExitSearchesService');

/* GET high exit searches with validation and error handling. */
const highExitSearchesController = async (req, res) => {
    try {
        // Validate exit rate threshold
        if (req.query.minExitRate && (isNaN(req.query.minExitRate) || req.query.minExitRate < 0 || req.query.minExitRate > 100)) {
            return res.status(400).json({ 
                error: 'Invalid minExitRate parameter. Must be between 0 and 100.' 
            });
        }

        // Validate limit parameter
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 100)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be between 1 and 100.' 
            });
        }

        await highExitSearchesService.highExitSearchService(req, res);
        
    } catch (error) {
        console.error('Error in highExitSearchesController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching high exit searches.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { highExitSearchesController };