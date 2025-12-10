var express = require('express');
var router = express.Router();
var synonymMissesService = require('../service/synonymMissesService');

/* GET synonym misses with validation and error handling. */
const synonymMissesController = async (req, res) => {
    try {
        // Validate limit parameter
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 100)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be between 1 and 100.' 
            });
        }

        // Validate confidence threshold
        if (req.query.confidence && (isNaN(req.query.confidence) || req.query.confidence < 0 || req.query.confidence > 1)) {
            return res.status(400).json({ 
                error: 'Invalid confidence parameter. Must be between 0 and 1.' 
            });
        }

        await synonymMissesService.synonymMissesService(req, res);
        
    } catch (error) {
        console.error('Error in synonymMissesController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching synonym misses.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { synonymMissesController };