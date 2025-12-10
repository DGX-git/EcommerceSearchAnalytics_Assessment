var express = require('express');
var router = express.Router();
var searchByLocationOrRegionService = require('../service/searchByLocationOrRegionService');

/* GET search by location or region with validation and error handling. */
const searchByLocationOrRegionController = async (req, res) => {
    try {
        // Validate region/country code format
        if (req.query.region && typeof req.query.region !== 'string') {
            return res.status(400).json({ 
                error: 'Invalid region parameter. Must be a string.' 
            });
        }

        // Validate limit parameter
        if (req.query.limit && (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 100)) {
            return res.status(400).json({ 
                error: 'Invalid limit parameter. Must be between 1 and 100.' 
            });
        }

        // Sanitize region input to prevent injection
        if (req.query.region) {
            req.query.region = req.query.region.trim().substring(0, 100);
        }

        await searchByLocationOrRegionService.searchByLocationOrRegionService(req, res);
        
    } catch (error) {
        console.error('Error in searchByLocationOrRegionController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching location-based search data.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { searchByLocationOrRegionController };