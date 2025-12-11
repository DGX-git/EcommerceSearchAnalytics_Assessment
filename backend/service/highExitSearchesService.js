// const models = require('../models');
// const { Op, sequelize } = require('sequelize');

// /**
//  * Service to identify high-exit searches (high bounce rate keywords)
//  * High-exit searches have zero results or very few results (<5)
//  * Uses Sequelize ORM with application-layer filtering and calculations
//  */
// const highExitSearchService = async(request, response) => {
//     try {
//         // Fetch all searches with keywords
//         const searches = await models.Search.findAll({
//             attributes: ['search_id', 'search_keyword', 'total_results'],
//             where: {
//                 search_keyword: {
//                     [Op.and]: [
//                         { [Op.ne]: null },
//                         { [Op.ne]: '' }
//                     ]
//                 }
//             },
//             raw: true
//         });

//         // Group searches by keyword and calculate exit rates
//         const keywordStats = {};

//         searches.forEach(search => {
//             const keyword = search.search_keyword;
//             const isExitSearch = search.total_results === 0 || 
//                                (search.total_results > 0 && search.total_results < 5);

//             if (!keywordStats[keyword]) {
//                 keywordStats[keyword] = {
//                     total_searches: 0,
//                     zero_result_searches: 0,
//                     low_result_searches: 0,
//                     exit_searches: 0,
//                     search_ids: new Set()
//                 };
//             }

//             keywordStats[keyword].total_searches++;
//             keywordStats[keyword].search_ids.add(search.search_id);

//             if (search.total_results === 0) {
//                 keywordStats[keyword].zero_result_searches++;
//                 keywordStats[keyword].exit_searches++;
//             } else if (search.total_results > 0 && search.total_results < 5) {
//                 keywordStats[keyword].low_result_searches++;
//                 keywordStats[keyword].exit_searches++;
//             }
//         });

//         // Calculate exit rates and filter results
//         const result = Object.entries(keywordStats)
//             .filter(([_, stats]) => stats.search_ids.size > 0)
//             .map(([keyword, stats]) => ({
//                 keyword,
//                 total_searches: stats.search_ids.size,
//                 zero_result_searches: stats.zero_result_searches,
//                 low_result_searches: stats.low_result_searches,
//                 exit_rate: parseFloat(((stats.exit_searches * 100.0 / stats.search_ids.size).toFixed(2)))
//             }))
//             .sort((a, b) => b.exit_rate - a.exit_rate)
//             .slice(0, 20);

//         response.status(200).json(result);
//     } catch (error) {
//         console.error('Failed to fetch high exit searches:', error);
//         response.status(500).json({ error: 'Failed to fetch high exit search data' });
//     }
// };

// module.exports = { highExitSearchService };




// backend/service/highExitSearchesService.js
const models = require('../models');
const { Op } = require('sequelize');

/**
 * Service to identify high-exit searches (high bounce rate keywords)
 * High-exit searches have zero results or very few results (<5)
 * Supports optional date filtering via ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
const highExitSearchService = async (request, response) => {
  try {
    const { startDate, endDate } = request.query || {};

    const where = {
      search_keyword: {
        [Op.and]: [
          { [Op.ne]: null },
          { [Op.ne]: '' }
        ]
      }
    };

    if (startDate) where.search_date = { ...(where.search_date || {}), [Op.gte]: startDate };
    if (endDate) where.search_date = { ...(where.search_date || {}), [Op.lte]: endDate };

    // Fetch searches with optional date filter
    const searches = await models.Search.findAll({
      attributes: ['search_id', 'search_keyword', 'total_results', 'search_date'],
      where,
      raw: true
    });

    // Group searches by keyword and calculate exit rates
    const keywordStats = {};

    searches.forEach(search => {
      const keyword = search.search_keyword;
      if (!keyword) return;

      const isExitSearch = search.total_results === 0 || (search.total_results > 0 && search.total_results < 5);

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

    // Calculate exit rates and prepare response
    const result = Object.entries(keywordStats)
      .filter(([_, stats]) => stats.search_ids.size > 0)
      .map(([keyword, stats]) => {
        const total = stats.search_ids.size;
        const exits = stats.exit_searches;
        const exit_rate = total > 0 ? parseFloat(((exits * 100.0) / total).toFixed(2)) : 0;
        return {
          keyword,
          total_searches: total,
          exits,
          exit_rate
        };
      })
      .sort((a, b) => b.exit_rate - a.exit_rate)
      .slice(0, 200);

    response.status(200).json(result);
  } catch (error) {
    console.error('Failed to fetch high exit searches:', error);
    response.status(500).json({ error: 'Failed to fetch high exit search data' });
  }
};

module.exports = { highExitSearchService };