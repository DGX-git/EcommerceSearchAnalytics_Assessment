const models = require('../models');
const { Op, fn, col, sequelize } = require('sequelize');

/**
 * Service to calculate search failure rates
 * A search fails if: zero results, very few results (<2), or poor ratings (<3)
 * Uses Sequelize ORM with application-layer transformations for complex logic
 */
const searchFailRateService = async(request, response) => {
    try {
        // Fetch all searches with keywords
        const searches = await models.Search.findAll({
            attributes: ['search_id', 'search_keyword', 'total_results', 'min_rating'],
            where: {
                search_keyword: {
                    [Op.and]: [
                        { [Op.ne]: null },
                        { [Op.ne]: '' }
                    ]
                }
            },
            raw: true
        });

        // Group searches by keyword and calculate failure metrics
        const keywordStats = {};
        
        searches.forEach(search => {
            const keyword = search.search_keyword;
            const isFailed = search.total_results === 0 || 
                           search.total_results < 2 || 
                           (search.total_results > 0 && search.min_rating < 3);

            if (!keywordStats[keyword]) {
                keywordStats[keyword] = {
                    total_searches: 0,
                    failed_searches: 0,
                    zero_result_count: 0,
                    low_result_count: 0,
                    low_rating_count: 0,
                    search_ids: new Set()
                };
            }

            keywordStats[keyword].total_searches++;
            keywordStats[keyword].search_ids.add(search.search_id);
            
            if (isFailed) {
                keywordStats[keyword].failed_searches++;
            }
            
            if (search.total_results === 0) {
                keywordStats[keyword].zero_result_count++;
            } else if (search.total_results < 2) {
                keywordStats[keyword].low_result_count++;
            } else if (search.min_rating < 3) {
                keywordStats[keyword].low_rating_count++;
            }
        });

        // Calculate failure rates and filter results
        const result = Object.entries(keywordStats)
            .filter(([_, stats]) => stats.search_ids.size >= 2) // HAVING COUNT >= 2
            .map(([keyword, stats]) => ({
                keyword,
                total_searches: stats.search_ids.size,
                failed_searches: stats.failed_searches,
                fail_rate: parseFloat(((stats.failed_searches * 100.0 / stats.search_ids.size).toFixed(2))),
                zero_result_count: stats.zero_result_count,
                low_result_count: stats.low_result_count,
                low_rating_count: stats.low_rating_count
            }))
            .sort((a, b) => b.fail_rate - a.fail_rate)
            .slice(0, 20);

        response.status(200).json(result);
    } catch (error) {
        console.error('Failed to fetch search fail rate:', error);
        response.status(500).json({ error: 'Failed to fetch search fail rate data' });
    }
};

module.exports = { searchFailRateService };
