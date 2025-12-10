var express = require('express');
var router = express.Router();
var brandSearchVolumeService = require('../service/brandSearchVolumeService');

/* GET brand search volume with validation and error handling. */
const brandSearchVolumeController = async (req, res) => {
    try {
        // Validate limit parameter
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 100)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be between 1 and 100.' 
            });
        }

        // Validate brand name if provided (sanitize for SQL injection prevention)
        if (req.query.brand && typeof req.query.brand !== 'string') {
            return res.status(400).json({ 
                error: 'Invalid brand parameter. Must be a string.' 
            });
        }

        await brandSearchVolumeService.brandSearchVolumeService(req, res);
        
    } catch (error) {
        console.error('Error in brandSearchVolumeController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching brand search volume.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { brandSearchVolumeController };