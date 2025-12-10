var express = require('express');
var router = express.Router();
var lowResultSearchService = require('../service/lowResultSearchesService');

/* GET low result searches with validation and error handling. */
const lowResultSearchesController = async (req, res) => {
    try {
        // Validate result count threshold
        if (req.query.maxResults && (isNaN(req.query.maxResults) || req.query.maxResults < 0 || req.query.maxResults > 100)) {
            return res.status(400).json({ 
                error: 'Invalid maxResults parameter. Must be between 0 and 100.' 
            });
        }

        // Validate limit parameter
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 100)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be between 1 and 100.' 
            });
        }

        await lowResultSearchService.lowResultSearchService(req, res);
        
    } catch (error) {
        console.error('Error in lowResultSearchesController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching low result searches.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { lowResultSearchesController };