// const { Op, fn, col } = require('sequelize');
// const models = require('../models');

// const topSearchVolumeService = async(request, response) => {
//     try {
//         // Get current date and calculate the start of the week (last 7 days)
//         const currentDate = new Date();
//         const startOfWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        
//         // Query to get top search keywords grouped by search_keyword with their count for the past week
//         const result = await models.Search.findAll({
//             attributes: [
//                 ['search_keyword', 'keyword'],
//                 [fn('COUNT', col('search_id')), 'search_volume']
//             ],
//             where: {
//                 search_date: { [Op.gte]: startOfWeek },
//                 search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
//             },
//             group: ['search_keyword'],
//             order: [[fn('COUNT', col('search_id')), 'DESC']],
//             limit: 20,
//             subQuery: false,
//             raw: true
//         });
        
//         response.status(200).json(result);
//     } catch (error) {
//         console.error('Failed to fetch top search volume', error);
//         response.status(500).json({ error: 'Failed to fetch data' });
//     }
// }

// module.exports = { topSearchVolumeService };




const { Op, fn, col } = require('sequelize');
const models = require('../models');

/**
 * topSearchVolumeService
 * Query params:
 *  - startDate (ISO date string) optional
 *  - endDate (ISO date string) optional
 *
 * Returns rows: { keyword, search_volume }
 */
const topSearchVolumeService = async (request, response) => {
  try {
    const { startDate, endDate } = request.query || {};

    let start = null;
    let end = null;

    if (startDate && !isNaN(Date.parse(startDate))) {
      start = new Date(startDate);
    }

    if (endDate && !isNaN(Date.parse(endDate))) {
      end = new Date(endDate);
      // make end inclusive to end of day
      end.setHours(23, 59, 59, 999);
    }

    // default to last 7 days if none provided
    if (!start && !end) {
      const now = new Date();
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const where = {
      search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
    };

    if (start && end) {
      where.search_date = { [Op.gte]: start, [Op.lte]: end };
    } else if (start) {
      where.search_date = { [Op.gte]: start };
    } else if (end) {
      where.search_date = { [Op.lte]: end };
    }

    const result = await models.Search.findAll({
      attributes: [
        ['search_keyword', 'keyword'],
        [fn('COUNT', col('search_id')), 'search_volume']
      ],
      where,
      group: ['search_keyword'],
      order: [[fn('COUNT', col('search_id')), 'DESC']],
      limit: 50,
      subQuery: false,
      raw: true
    });

    response.status(200).json(result);
  } catch (error) {
    console.error('Failed to fetch top search volume', error);
    response.status(500).json({ error: 'Failed to fetch data' });
  }
}

module.exports = { topSearchVolumeService };