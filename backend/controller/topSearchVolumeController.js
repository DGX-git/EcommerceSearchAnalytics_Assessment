var express = require('express');
var router = express.Router();
var topSearchVolumeService = require('../service/topSearchVolumeService');

/* GET top search volume with validation and error handling. */
const topSearchVolumeController = async (req, res) => {
    try {
        // Validate limit parameter
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 100)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be between 1 and 100.' 
            });
        }

        // Validate days parameter (for time range)
        if (req.query.days && (isNaN(req.query.days) || req.query.days < 1 || req.query.days > 365)) {
            return res.status(400).json({ 
                error: 'Invalid days parameter. Must be between 1 and 365.' 
            });
        }

        await topSearchVolumeService.topSearchVolumeService(req, res);
        
    } catch (error) {
        console.error('Error in topSearchVolumeController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching top search volume.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = {topSearchVolumeController};