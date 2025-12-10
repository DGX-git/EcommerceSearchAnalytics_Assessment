var express = require('express');
var router = express.Router();
var priceIntentSegmentsService = require('../service/priceIntentSegmentsService');

/* GET price intent segments with validation and error handling. */
const priceIntentSegmentsController = async (req, res) => {
    try {
        // Validate segment type if provided
        const validSegments = ['budget', 'mid-range', 'premium', 'luxury'];
        if (req.query.segment && !validSegments.includes(req.query.segment.toLowerCase())) {
            return res.status(400).json({ 
                error: `Invalid segment parameter. Must be one of: ${validSegments.join(', ')}` 
            });
        }

        // Validate limit parameter
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 100)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be between 1 and 100.' 
            });
        }

        await priceIntentSegmentsService.priceIntentSegmentService(req, res);
        
    } catch (error) {
        console.error('Error in priceIntentSegmentsController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching price intent segments.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { priceIntentSegmentsController };