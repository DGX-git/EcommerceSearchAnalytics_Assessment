var express = require('express');
var router = express.Router();
var ratingSensitivityService = require('../service/ratingSensitivityService');

/* GET rating sensitivity with validation and error handling. */
const ratingSensitivityController = async (req, res) => {
    try {
        // Validate minimum rating parameter
        if (req.query.minRating && (isNaN(req.query.minRating) || req.query.minRating < 0 || req.query.minRating > 5)) {
            return res.status(400).json({ 
                error: 'Invalid minRating parameter. Must be between 0 and 5.' 
            });
        }

        // Validate limit parameter
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 100)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be between 1 and 100.' 
            });
        }

        await ratingSensitivityService.ratingSensitivityService(req, res);
        
    } catch (error) {
        console.error('Error in ratingSensitivityController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching rating sensitivity.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { ratingSensitivityController };