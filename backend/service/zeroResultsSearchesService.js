// const { Op, fn, col } = require('sequelize');
// const models = require('../models');

// const zeroResultsSearchesService = async(request, response) => {
//     try {
//         // Fetch keywords that returned zero results using Sequelize ORM
//         const zeroResultsSearches = await models.Search.findAll({
//             attributes: [
//                 ['search_keyword', 'keyword'],
//                 [fn('COUNT', col('search_id')), 'count']
//             ],
//             where: {
//                 total_results: 0,
//                 search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
//             },
//             group: ['search_keyword'],
//             order: [[fn('COUNT', col('search_id')), 'DESC']],
//             limit: 20,
//             subQuery: false,
//             raw: true
//         });
        
//         response.status(200).json(zeroResultsSearches);
//     } catch (error) {
//         console.error('Failed to fetch zero results searches', error);
//         response.status(500).json({ error: 'Failed to fetch data' });
//     }
// }

// module.exports = { zeroResultsSearchesService };




const { Op, fn, col } = require('sequelize');
const models = require('../models');

/**
 * zeroResultsSearchesService
 * Query params:
 *  - startDate (ISO) optional
 *  - endDate (ISO) optional
 *
 * Returns rows: { keyword, search_count, zero_result_count }
 */
const zeroResultsSearchesService = async (request, response) => {
  try {
    const { startDate, endDate } = request.query || {};

    let start = null;
    let end = null;
    if (startDate && !isNaN(Date.parse(startDate))) start = new Date(startDate);
    if (endDate && !isNaN(Date.parse(endDate))) {
      end = new Date(endDate);
      // make end inclusive to end of day
      end.setHours(23, 59, 59, 999);
    }

    // If neither provided, default to last 28 days
    if (!start && !end) {
      const now = new Date();
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      start = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
      start.setHours(0, 0, 0, 0);
    } else if (start && !end) {
      end = new Date(start.getTime() + 28 * 24 * 60 * 60 * 1000 - 1);
    } else if (!start && end) {
      start = new Date(end.getTime() - 28 * 24 * 60 * 60 * 1000 + 1);
      start.setHours(0, 0, 0, 0);
    }

    const dateWhere = { [Op.gte]: start, [Op.lte]: end };

    // total searches per keyword in window
    const totalWhere = {
      search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] },
      search_date: dateWhere
    };

    const totalCounts = await models.Search.findAll({
      attributes: [
        ['search_keyword', 'keyword'],
        [fn('COUNT', col('search_id')), 'search_count']
      ],
      where: totalWhere,
      group: ['search_keyword'],
      raw: true,
      subQuery: false
    });

    // zero-result counts per keyword in window
    const zeroWhere = {
      total_results: 0,
      search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] },
      search_date: dateWhere
    };

    const zeroCounts = await models.Search.findAll({
      attributes: [
        ['search_keyword', 'keyword'],
        [fn('COUNT', col('search_id')), 'zero_result_count']
      ],
      where: zeroWhere,
      group: ['search_keyword'],
      raw: true,
      subQuery: false
    });

    // Merge into map
    const map = new Map();

    totalCounts.forEach(row => {
      const kw = String(row.keyword || '');
      map.set(kw, { keyword: kw, search_count: Number(row.search_count || 0), zero_result_count: 0 });
    });

    zeroCounts.forEach(row => {
      const kw = String(row.keyword || '');
      if (map.has(kw)) {
        map.get(kw).zero_result_count = Number(row.zero_result_count || 0);
      } else {
        map.set(kw, { keyword: kw, search_count: 0, zero_result_count: Number(row.zero_result_count || 0) });
      }
    });

    const result = Array.from(map.values())
      .map(r => ({
        keyword: r.keyword,
        search_count: r.search_count,
        zero_result_count: r.zero_result_count
      }))
      // sort by zero_result_count desc (fail most often)
      .sort((a, b) => b.zero_result_count - a.zero_result_count)
      .slice(0, 200);

    return response.status(200).json(result);
  } catch (error) {
    console.error('Failed to fetch zero results searches', error);
    return response.status(500).json({ error: 'Failed to fetch data' });
  }
};

module.exports = { zeroResultsSearchesService };