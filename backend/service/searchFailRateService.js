// const models = require('../models');
// const { Op, fn, col, sequelize } = require('sequelize');

// /**
//  * Service to calculate search failure rates
//  * A search fails if: zero results, very few results (<2), or poor ratings (<3)
//  * Uses Sequelize ORM with application-layer transformations for complex logic
//  */
// const searchFailRateService = async(request, response) => {
//     try {
//         // Fetch all searches with keywords
//         const searches = await models.Search.findAll({
//             attributes: ['search_id', 'search_keyword', 'total_results', 'min_rating'],
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

//         // Group searches by keyword and calculate failure metrics
//         const keywordStats = {};
        
//         searches.forEach(search => {
//             const keyword = search.search_keyword;
//             const isFailed = search.total_results === 0 || 
//                            search.total_results < 2 || 
//                            (search.total_results > 0 && search.min_rating < 3);

//             if (!keywordStats[keyword]) {
//                 keywordStats[keyword] = {
//                     total_searches: 0,
//                     failed_searches: 0,
//                     zero_result_count: 0,
//                     low_result_count: 0,
//                     low_rating_count: 0,
//                     search_ids: new Set()
//                 };
//             }

//             keywordStats[keyword].total_searches++;
//             keywordStats[keyword].search_ids.add(search.search_id);
            
//             if (isFailed) {
//                 keywordStats[keyword].failed_searches++;
//             }
            
//             if (search.total_results === 0) {
//                 keywordStats[keyword].zero_result_count++;
//             } else if (search.total_results < 2) {
//                 keywordStats[keyword].low_result_count++;
//             } else if (search.min_rating < 3) {
//                 keywordStats[keyword].low_rating_count++;
//             }
//         });

//         // Calculate failure rates and filter results
//         const result = Object.entries(keywordStats)
//             .filter(([_, stats]) => stats.search_ids.size >= 2) // HAVING COUNT >= 2
//             .map(([keyword, stats]) => ({
//                 keyword,
//                 total_searches: stats.search_ids.size,
//                 failed_searches: stats.failed_searches,
//                 fail_rate: parseFloat(((stats.failed_searches * 100.0 / stats.search_ids.size).toFixed(2))),
//                 zero_result_count: stats.zero_result_count,
//                 low_result_count: stats.low_result_count,
//                 low_rating_count: stats.low_rating_count
//             }))
//             .sort((a, b) => b.fail_rate - a.fail_rate)
//             .slice(0, 20);

//         response.status(200).json(result);
//     } catch (error) {
//         console.error('Failed to fetch search fail rate:', error);
//         response.status(500).json({ error: 'Failed to fetch search fail rate data' });
//     }
// };

// module.exports = { searchFailRateService };





const models = require('../models');
const { Op } = require('sequelize');

/**
 * Service to calculate search failure rates
 * Query params:
 *  - startDate (ISO date)
 *  - endDate (ISO date)
 *
 * A search is considered failed if:
 *  - total_results === 0
 *  - total_results < 2
 *  - OR min_rating < 3 (when results > 0)
 *
 * Returns array of objects:
 *  { keyword, fail_count, total_searches, fail_rate }
 */
const searchFailRateService = async (request, response) => {
  try {
    const { startDate, endDate } = request.query || {};

    // Build date filters
    const dateWhere = {};
    if (startDate && !isNaN(Date.parse(startDate))) dateWhere[Op.gte] = startDate;
    if (endDate && !isNaN(Date.parse(endDate))) dateWhere[Op.lte] = endDate;

    const where = {
      search_keyword: {
        [Op.and]: [
          { [Op.ne]: null },
          { [Op.ne]: '' }
        ]
      }
    };
    if (Object.keys(dateWhere).length > 0) where.search_date = dateWhere;

    // fetch relevant searches
    const searches = await models.Search.findAll({
      attributes: ['search_id', 'search_keyword', 'total_results', 'min_rating', 'search_date'],
      where,
      raw: true
    });

    // Aggregate per keyword
    const stats = {};
    searches.forEach(s => {
      const kw = (s.search_keyword || '').trim();
      if (!kw) return;

      if (!stats[kw]) {
        stats[kw] = {
          search_ids: new Set(),
          fail_count: 0
        };
      }

      stats[kw].search_ids.add(s.search_id);

      const total_results = Number(s.total_results ?? 0);
      const min_rating = Number(s.min_rating ?? 0);

      const isFailed = total_results === 0 || total_results < 2 || (total_results > 0 && min_rating < 3);
      if (isFailed) stats[kw].fail_count++;
    });

    const result = Object.entries(stats)
      .map(([keyword, entry]) => {
        const total_searches = entry.search_ids.size;
        const fail_count = entry.fail_count;
        const fail_rate = total_searches > 0 ? parseFloat(((fail_count * 100.0) / total_searches).toFixed(2)) : 0;
        return {
          keyword,
          fail_count,
          total_searches,
          fail_rate
        };
      })
      .filter(r => r.total_searches > 0) // ensure valid rows
      .sort((a, b) => b.fail_rate - a.fail_rate)
      .slice(0, 200);

    return response.status(200).json(result);
  } catch (error) {
    console.error('Failed to fetch search fail rate:', error);
    return response.status(500).json({ error: 'Failed to fetch search fail rate data' });
  }
};

module.exports = { searchFailRateService };