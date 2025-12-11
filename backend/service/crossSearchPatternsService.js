const models = require('../models');
const { Op, sequelize } = require('sequelize');

/**
 * Service to identify sequential search patterns (keyword sequences)
 * Finds patterns like "serum" followed by "vitamin C" within a customer's search history
 * Uses Sequelize ORM with application-layer sequence matching
 */
const crossSearchPatternsService = async(request, response) => {
    try {
        // Fetch all searches ordered by customer and date
        const searches = await models.Search.findAll({
            attributes: ['search_id', 'customer_id', 'search_keyword', 'search_date'],
            where: {
                search_keyword: {
                    [Op.and]: [
                        { [Op.ne]: null },
                        { [Op.ne]: '' }
                    ]
                },
                customer_id: {
                    [Op.ne]: null
                }
            },
            order: [['customer_id', 'ASC'], ['search_date', 'ASC']],
            raw: true
        });

        // Group searches by customer
        const customerSearches = {};
        searches.forEach(search => {
            const customerId = search.customer_id;
            if (!customerSearches[customerId]) {
                customerSearches[customerId] = [];
            }
            customerSearches[customerId].push({
                keyword: search.search_keyword,
                date: new Date(search.search_date)
            });
        });

        // Extract sequential patterns within 7-day windows
        const patterns = {};

        Object.entries(customerSearches).forEach(([customerId, customerKeywords]) => {
            // Generate all pairs of consecutive and near-consecutive searches
            for (let i = 0; i < customerKeywords.length - 1; i++) {
                const current = customerKeywords[i];
                
                // Look ahead up to 2 searches within 7 days
                for (let j = i + 1; j < Math.min(i + 3, customerKeywords.length); j++) {
                    const next = customerKeywords[j];
                    
                    // Check if within 7-day window
                    const daysDiff = (next.date - current.date) / (1000 * 60 * 60 * 24);
                    if (daysDiff <= 7 && current.keyword !== next.keyword) {
                        const patternKey = `${current.keyword} → ${next.keyword}`;
                        
                        if (!patterns[patternKey]) {
                            patterns[patternKey] = {
                                pattern: patternKey,
                                frequency: 0,
                                user_ids: new Set()
                            };
                        }
                        
                        patterns[patternKey].frequency++;
                        patterns[patternKey].user_ids.add(customerId);
                    }
                }
            }
        });

        // Get total search count for percentage calculation
        const totalSearches = searches.filter(s => 
            s.search_keyword && s.search_keyword.trim() !== ''
        ).length;

        // Filter patterns with frequency >= 2 and calculate metrics
        const result = Object.values(patterns)
            .filter(p => p.frequency >= 2)
            .map(p => ({
                pattern: p.pattern,
                frequency: p.frequency,
                user_count: p.user_ids.size,
                pattern_percentage: parseFloat(((p.frequency * 100.0 / totalSearches).toFixed(2)))
            }))
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 30);

        response.status(200).json(result);
    } catch (error) {
        console.error('Failed to fetch cross search patterns:', error);
        response.status(500).json({ error: 'Failed to fetch search pattern data' });
    }
};

module.exports = { crossSearchPatternsService };
