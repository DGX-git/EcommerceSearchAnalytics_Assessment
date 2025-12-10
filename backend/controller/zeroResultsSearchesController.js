var express = require('express');
var router = express.Router();
var zeroResultsSearchesService = require('../service/zeroResultsSearchesService');

/* GET zero results searches with validation and error handling. */
const zeroResultsSearchesController = async (req, res) => {
    try {
        // Validate limit parameter
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 100)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be between 1 and 100.' 
            });
        }

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

        await zeroResultsSearchesService.zeroResultsSearchesService(req, res);
        
    } catch (error) {
        console.error('Error in zeroResultsSearchesController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching zero results searches.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { zeroResultsSearchesController };