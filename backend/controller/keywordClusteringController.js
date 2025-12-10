var express = require('express');
var router = express.Router();
var keywordClusteringService = require('../service/keywordClusteringService');

/* GET keyword clustering with validation and error handling. */
const keywordClusteringController = async (req, res) => {
    try {
        // Validate cluster count parameter
        if (req.query.clusterCount && (isNaN(req.query.clusterCount) || req.query.clusterCount < 2 || req.query.clusterCount > 50)) {
            return res.status(400).json({ 
                error: 'Invalid clusterCount parameter. Must be between 2 and 50.' 
            });
        }

        // Validate minimum similarity threshold
        if (req.query.similarity && (isNaN(req.query.similarity) || req.query.similarity < 0 || req.query.similarity > 1)) {
            return res.status(400).json({ 
                error: 'Invalid similarity parameter. Must be between 0 and 1.' 
            });
        }

        await keywordClusteringService.keywordClusteringService(req, res);
        
    } catch (error) {
        console.error('Error in keywordClusteringController:', error);
        
        if (error.name === 'SequelizeConnectionError') {
            return res.status(503).json({ 
                error: 'Database connection error. Please try again later.' 
            });
        }
        
        res.status(500).json({ 
            error: 'An unexpected error occurred while fetching keyword clusters.',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

module.exports = { keywordClusteringController };