var express = require('express');
var router = express.Router();
var newVsReturningCustomerSearchesService = require('../service/newVsReturningCustomerSearchesService');

/* GET new vs returning customer searches with validation and error handling. */
const newVsReturningCustomerSearchesController = async (req, res) => {
    try {
        // Validate customer type filter
        const validTypes = ['new', 'returning', 'all'];
        if (req.query.customerType && !validTypes.includes(req.query.customerType.toLowerCase())) {
            return res.status(400).json({ 
                error: `Invalid customerType parameter. Must be one of: ${validTypes.join(', ')}` 
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

        await newVsReturningCustomerSearchesService.newVsReturningCustomerSearchesService(req, res);
        
    } catch (error) {
        console.error('Error in newVsReturningCustomerSearchesController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching customer search data.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { newVsReturningCustomerSearchesController };