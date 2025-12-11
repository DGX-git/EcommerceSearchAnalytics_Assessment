const models = require('../models');
const { Op, sequelize } = require('sequelize');

/**
 * Service to identify high-exit searches (high bounce rate keywords)
 * High-exit searches have zero results or very few results (<5)
 * Uses Sequelize ORM with application-layer filtering and calculations
 */
const highExitSearchService = async(request, response) => {
    try {
        // Fetch all searches with keywords
        const searches = await models.Search.findAll({
            attributes: ['search_id', 'search_keyword', 'total_results'],
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

        // Group searches by keyword and calculate exit rates
        const keywordStats = {};

        searches.forEach(search => {
            const keyword = search.search_keyword;
            const isExitSearch = search.total_results === 0 || 
                               (search.total_results > 0 && search.total_results < 5);

            if (!keywordStats[keyword]) {
                keywordStats[keyword] = {
                    total_searches: 0,
                    zero_result_searches: 0,
                    low_result_searches: 0,
                    exit_searches: 0,
                    search_ids: new Set()
                };
            }

            keywordStats[keyword].total_searches++;
            keywordStats[keyword].search_ids.add(search.search_id);

            if (search.total_results === 0) {
                keywordStats[keyword].zero_result_searches++;
                keywordStats[keyword].exit_searches++;
            } else if (search.total_results > 0 && search.total_results < 5) {
                keywordStats[keyword].low_result_searches++;
                keywordStats[keyword].exit_searches++;
            }
        });

        // Calculate exit rates and filter results
        const result = Object.entries(keywordStats)
            .filter(([_, stats]) => stats.search_ids.size > 0)
            .map(([keyword, stats]) => ({
                keyword,
                total_searches: stats.search_ids.size,
                zero_result_searches: stats.zero_result_searches,
                low_result_searches: stats.low_result_searches,
                exit_rate: parseFloat(((stats.exit_searches * 100.0 / stats.search_ids.size).toFixed(2)))
            }))
            .sort((a, b) => b.exit_rate - a.exit_rate)
            .slice(0, 20);

        response.status(200).json(result);
    } catch (error) {
        console.error('Failed to fetch high exit searches:', error);
        response.status(500).json({ error: 'Failed to fetch high exit search data' });
    }
};

module.exports = { highExitSearchService };
