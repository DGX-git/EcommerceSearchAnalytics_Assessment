var express = require('express');
var router = express.Router();
var conversionIntentFunnelService = require('../service/conversionIntentFunnelService');

/* GET conversion intent funnel with validation and error handling. */
const conversionIntentFunnelController = async (req, res) => {
    try {
        // Validate funnel stage
        const validStages = ['search', 'view', 'cart', 'purchase', 'all'];
        if (req.query.stage && !validStages.includes(req.query.stage.toLowerCase())) {
            return res.status(400).json({ 
                error: `Invalid stage parameter. Must be one of: ${validStages.join(', ')}` 
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

        await conversionIntentFunnelService.conversionIntentFunnelService(req, res);
        
    } catch (error) {
        console.error('Error in conversionIntentFunnelController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching conversion funnel data.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { conversionIntentFunnelController };