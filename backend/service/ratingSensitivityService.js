const models = require('../models');
const { Op, fn, col, sequelize } = require('sequelize');

/**
 * Service to segment searches by rating sensitivity
 * Categorizes: Low (≤2 stars), Medium (3-4 stars), High (5 stars)
 * Uses Sequelize ORM with application-layer grouping and calculations
 */
const ratingSensitivityService = async(request, response) => {
    try {
        // Fetch all searches with valid ratings
        const searches = await models.Search.findAll({
            attributes: ['search_id', 'min_rating'],
            where: {
                min_rating: {
                    [Op.and]: [
                        { [Op.ne]: null },
                        { [Op.gte]: 0 }
                    ]
                }
            },
            raw: true
        });

        // Get total count of valid searches for percentage calculation
        const totalValidSearches = searches.length;

        // Group and segment searches by rating sensitivity
        const segments = {
            'Low (≤2 stars)': { ratings: [], search_ids: new Set() },
            'Medium (3-4 stars)': { ratings: [], search_ids: new Set() },
            'High (5 stars)': { ratings: [], search_ids: new Set() }
        };

        searches.forEach(search => {
            const rating = parseFloat(search.min_rating);
            const searchId = search.search_id;

            if (rating <= 2) {
                segments['Low (≤2 stars)'].ratings.push(rating);
                segments['Low (≤2 stars)'].search_ids.add(searchId);
            } else if (rating > 2 && rating < 5) {
                segments['Medium (3-4 stars)'].ratings.push(rating);
                segments['Medium (3-4 stars)'].search_ids.add(searchId);
            } else if (rating >= 5) {
                segments['High (5 stars)'].ratings.push(rating);
                segments['High (5 stars)'].search_ids.add(searchId);
            }
        });

        // Calculate statistics for each segment
        const result = Object.entries(segments)
            .map(([range, data]) => {
                const searchCount = data.search_ids.size;
                const avgRating = data.ratings.length > 0
                    ? parseFloat((data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(2))
                    : 0;
                const percentage = totalValidSearches > 0
                    ? parseFloat(((searchCount * 100.0 / totalValidSearches).toFixed(2)))
                    : 0;

                return {
                    rating_range: range,
                    search_count: searchCount,
                    avg_rating: avgRating,
                    percentage
                };
            })
            .filter(item => item.search_count > 0)
            .sort((a, b) => {
                const order = { 'Low (≤2 stars)': 1, 'Medium (3-4 stars)': 2, 'High (5 stars)': 3 };
                return (order[a.rating_range] || 4) - (order[b.rating_range] || 4);
            });

        response.status(200).json(result);
    } catch (error) {
        console.error('Failed to fetch rating sensitivity:', error);
        response.status(500).json({ error: 'Failed to fetch rating sensitivity data' });
    }
};

module.exports = { ratingSensitivityService };
