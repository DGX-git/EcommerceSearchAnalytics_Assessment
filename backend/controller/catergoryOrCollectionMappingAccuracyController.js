var express = require('express');
var router = express.Router();
var categoryOrCollectionMappingAccuracyService = require('../service/catergoryOrCollectionMappingAccuracyService');

/* GET category or collection mapping accuracy with validation and error handling. */
const categoryOrCollectionMappingAccuracyController = async (req, res) => {
    try {
        // Validate accuracy threshold
        if (req.query.minAccuracy && (isNaN(req.query.minAccuracy) || req.query.minAccuracy < 0 || req.query.minAccuracy > 100)) {
            return res.status(400).json({ 
                error: 'Invalid minAccuracy parameter. Must be between 0 and 100.' 
            });
        }

        // Validate mapping type
        const validTypes = ['category', 'collection', 'both'];
        if (req.query.mappingType && !validTypes.includes(req.query.mappingType.toLowerCase())) {
            return res.status(400).json({ 
                error: `Invalid mappingType parameter. Must be one of: ${validTypes.join(', ')}` 
            });
        }

        await categoryOrCollectionMappingAccuracyService.categoryOrCollectionMappingAccuracyService(req, res);
        
    } catch (error) {
        console.error('Error in categoryOrCollectionMappingAccuracyController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching mapping accuracy.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { categoryOrCollectionMappingAccuracyController };