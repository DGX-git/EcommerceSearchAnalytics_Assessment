const models = require('../models');
const { Op, fn, col, sequelize } = require('sequelize');

/**
 * Service to segment searches by price intent ranges
 * Categorizes: Budget (≤$50), Mid-range ($51-$200), Premium (>$200)
 * Uses Sequelize ORM for database queries and application-layer transformations
 */
const priceIntentSegmentService = async(request, response) => {
    try {
        // Fetch all searches with max_price > 0
        const searches = await models.Search.findAll({
            attributes: ['search_id', 'max_price'],
            where: {
                max_price: {
                    [Op.gt]: 0
                }
            },
            raw: true
        });

        // Transform and segment data in application layer
        const segments = {
            'Budget (≤$50)': { count: 0, prices: [] },
            'Mid-range ($51-$200)': { count: 0, prices: [] },
            'Premium (>$200)': { count: 0, prices: [] }
        };

        searches.forEach(search => {
            const price = parseFloat(search.max_price);
            if (price <= 50) {
                segments['Budget (≤$50)'].count++;
                segments['Budget (≤$50)'].prices.push(price);
            } else if (price > 50 && price <= 200) {
                segments['Mid-range ($51-$200)'].count++;
                segments['Mid-range ($51-$200)'].prices.push(price);
            } else {
                segments['Premium (>$200)'].count++;
                segments['Premium (>$200)'].prices.push(price);
            }
        });

        // Calculate statistics for each segment
        const result = Object.entries(segments)
            .map(([segment, data]) => ({
                price_segment: segment,
                segment_count: data.count,
                avg_max_price: data.prices.length > 0 
                    ? parseFloat((data.prices.reduce((a, b) => a + b, 0) / data.prices.length).toFixed(2))
                    : 0,
                min_price: data.prices.length > 0 ? Math.min(...data.prices) : 0,
                max_price: data.prices.length > 0 ? Math.max(...data.prices) : 0
            }))
            .filter(item => item.segment_count > 0);

        response.status(200).json(result);
    } catch (error) {
        console.error('Failed to fetch price intent segments:', error);
        response.status(500).json({ error: 'Failed to fetch price intent segment data' });
    }
};

module.exports = { priceIntentSegmentService };
