const { Op } = require('sequelize');
const models = require('../models');

const attributeTrendsService = async(request, response) => {
    try {
        // Define the special attributes we want to track and their search patterns
        const attributePatterns = {
            'vegan': '%vegan%',
            'SPF': '%spf%',
            'acne-safe': '%acne%',
            'cruelty-free': '%cruelty-free%',
            'organic': '%organic%',
            'natural': '%natural%',
            'hypoallergenic': '%hypoallergenic%',
            'fragrance-free': '%fragrance-free%'
        };
        
        const attributeCounts = [];
        
        // Process each attribute and count searches
        for (const [attribute, pattern] of Object.entries(attributePatterns)) {
            const count = await models.Search.count({
                where: {
                    attributes: { [Op.iLike]: pattern },
                    [Op.not]: { attributes: null }
                }
            });
            
            if (count > 0) {
                attributeCounts.push({
                    attribute: attribute,
                    trend_value: count
                });
            }
        }
        
        // Sort by trend_value descending and limit to 20
        const sortedResults = attributeCounts
            .sort((a, b) => b.trend_value - a.trend_value)
            .slice(0, 20);
        
        response.status(200).json(sortedResults);
    } catch (error) {
        console.error('Failed to fetch attribute trends', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { attributeTrendsService };
