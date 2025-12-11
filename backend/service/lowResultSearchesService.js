const models = require('../models');
const { Op, sequelize } = require('sequelize');

/**
 * Service to identify keywords with very few results (avg < 5)
 * Helps identify search queries that have limited product availability
 * Uses Sequelize ORM with application-layer grouping and calculations
 */
const lowResultSearchService = async(request, response) => {
    try {
        // Fetch all searches with keywords and result counts
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

        // Group searches by keyword and calculate statistics
        const keywordStats = {};

        searches.forEach(search => {
            const keyword = search.search_keyword;
            
            if (!keywordStats[keyword]) {
                keywordStats[keyword] = {
                    results: [],
                    search_ids: new Set()
                };
            }
            
            keywordStats[keyword].results.push(parseFloat(search.total_results) || 0);
            keywordStats[keyword].search_ids.add(search.search_id);
        });

        // Filter for keywords with avg results < 5 and calculate metrics
        const result = Object.entries(keywordStats)
            .map(([keyword, stats]) => {
                const searchCount = stats.search_ids.size;
                const avgResults = stats.results.reduce((a, b) => a + b, 0) / stats.results.length;
                const minResults = Math.min(...stats.results);
                const maxResults = Math.max(...stats.results);

                return {
                    keyword,
                    avg_result_count: parseFloat(avgResults.toFixed(2)),
                    search_count: searchCount,
                    min_results: minResults,
                    max_results: maxResults
                };
            })
            .filter(item => item.avg_result_count < 5)
            .sort((a, b) => a.avg_result_count - b.avg_result_count)
            .slice(0, 20);

        response.status(200).json(result);
    } catch (error) {
        console.error('Failed to fetch low result searches:', error);
        response.status(500).json({ error: 'Failed to fetch low result search data' });
    }
};

module.exports = { lowResultSearchService };
