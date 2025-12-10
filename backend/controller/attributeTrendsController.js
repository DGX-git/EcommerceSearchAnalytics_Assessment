var express = require('express');
var router = express.Router();
var attributeTrendsService = require('../service/attributeTrendsService');

/* GET attribute trends with validation and error handling. */
const attributeTrendsController = async (req, res, next) => {
    try {
        // Validate query parameters if provided
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be a positive number.' 
            });
        }

        // Sanitize and validate date range if provided
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

        // Call service with validated request
        await attributeTrendsService.attributeTrendsService(req, res);
        
    } catch (error) {
        console.error('Error in attributeTrendsController:', error);
        
        // Handle specific error types
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({ 
                error: 'Validation error', 
                details: error.errors.map(e => e.message) 
            });
        }
        
        // Generic error handler
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching attribute trends.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { attributeTrendsController };