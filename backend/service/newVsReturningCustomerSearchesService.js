const models = require('../models');
const { Op, fn, col, sequelize } = require('sequelize');

/**
 * Service to segment customers as new or returning
 * Based on search frequency: New (1-2 searches), Returning (3+ searches)
 * Uses Sequelize ORM with application-layer aggregation
 */
const newVsReturningCustomerSearchesService = async(request, response) => {
    try {
        // Fetch all searches with customer data
        const searches = await models.Search.findAll({
            attributes: ['customer_id', 'search_id', 'min_rating', 'total_results'],
            where: {
                customer_id: {
                    [Op.ne]: null
                }
            },
            raw: true
        });

        // Group searches by customer and calculate stats
        const customerStats = {};
        
        searches.forEach(search => {
            const customerId = search.customer_id;
            
            if (!customerStats[customerId]) {
                customerStats[customerId] = {
                    search_count: 0,
                    ratings: [],
                    results: [],
                    search_ids: new Set()
                };
            }
            
            customerStats[customerId].search_count++;
            customerStats[customerId].search_ids.add(search.search_id);
            if (search.min_rating != null) {
                customerStats[customerId].ratings.push(parseFloat(search.min_rating));
            }
            if (search.total_results != null) {
                customerStats[customerId].results.push(parseFloat(search.total_results));
            }
        });

        // Segment customers and calculate aggregates
        const segments = {
            'New Customers': {
                unique_customers: 0,
                total_searches: 0,
                avg_rating_sum: 0,
                avg_results_sum: 0,
                count: 0
            },
            'Returning Customers': {
                unique_customers: 0,
                total_searches: 0,
                avg_rating_sum: 0,
                avg_results_sum: 0,
                count: 0
            }
        };

        Object.entries(customerStats).forEach(([customerId, stats]) => {
            const searchCount = stats.search_ids.size;
            const segment = searchCount <= 2 ? 'New Customers' : 'Returning Customers';
            
            const avgRating = stats.ratings.length > 0 
                ? stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length
                : 0;
            const avgResults = stats.results.length > 0
                ? stats.results.reduce((a, b) => a + b, 0) / stats.results.length
                : 0;

            segments[segment].unique_customers++;
            segments[segment].total_searches += searchCount;
            segments[segment].avg_rating_sum += avgRating;
            segments[segment].avg_results_sum += avgResults;
            segments[segment].count++;
        });

        // Calculate final metrics
        const result = Object.entries(segments)
            .filter(([_, data]) => data.unique_customers > 0)
            .map(([type, data]) => ({
                customer_type: type,
                unique_customers: data.unique_customers,
                total_searches: data.total_searches,
                avg_searches_per_customer: parseFloat((data.total_searches / data.unique_customers).toFixed(2)),
                avg_rating: parseFloat((data.avg_rating_sum / data.count).toFixed(2)),
                avg_results: parseFloat((data.avg_results_sum / data.count).toFixed(2))
            }))
            .sort((a, b) => b.total_searches - a.total_searches);

        response.status(200).json(result);
    } catch (error) {
        console.error('Failed to fetch new vs returning customer searches:', error);
        response.status(500).json({ error: 'Failed to fetch customer segment data' });
    }
};

module.exports = { newVsReturningCustomerSearchesService };
