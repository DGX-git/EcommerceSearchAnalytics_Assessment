// const { Op, fn, col, where } = require('sequelize');
// const models = require('../models');

// const trendingKeywordService = async(request, response) => {
//     try {
//         // Get current date
//         const currentDate = new Date();
        
//         // Calculate date ranges
//         const currentWeekStart = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
//         const currentWeekEnd = currentDate;
//         const previousWeekStart = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
//         const previousWeekEnd = currentWeekStart;
        
//         // Query to get search volumes for current week
//         const currentWeekData = await models.Search.findAll({
//             attributes: [
//                 ['search_keyword', 'keyword'],
//                 [fn('COUNT', col('search_id')), 'current_week_volume']
//             ],
//             where: {
//                 search_date: { [Op.gte]: currentWeekStart, [Op.lt]: currentWeekEnd },
//                 search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
//             },
//             group: ['search_keyword'],
//             subQuery: false,
//             raw: true
//         });
        
//         // Query to get search volumes for previous week
//         const previousWeekData = await models.Search.findAll({
//             attributes: [
//                 ['search_keyword', 'keyword'],
//                 [fn('COUNT', col('search_id')), 'previous_week_volume']
//             ],
//             where: {
//                 search_date: { [Op.gte]: previousWeekStart, [Op.lt]: previousWeekEnd },
//                 search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
//             },
//             group: ['search_keyword'],
//             subQuery: false,
//             raw: true
//         });
        
//         // Merge and calculate WoW change
//         const keywordMap = new Map();
        
//         // Add current week data
//         currentWeekData.forEach(item => {
//             keywordMap.set(item.keyword, {
//                 keyword: item.keyword,
//                 current_volume: item.current_week_volume,
//                 previous_volume: 0
//             });
//         });
        
//         // Add previous week data
//         previousWeekData.forEach(item => {
//             if (keywordMap.has(item.keyword)) {
//                 const existing = keywordMap.get(item.keyword);
//                 existing.previous_volume = item.previous_week_volume;
//             } else {
//                 keywordMap.set(item.keyword, {
//                     keyword: item.keyword,
//                     current_volume: 0,
//                     previous_volume: item.previous_week_volume
//                 });
//             }
//         });
        
//         // Calculate WoW percentage change
//         const trendingKeywords = Array.from(keywordMap.values())
//             .map(item => {
//                 let wowChange = 0;
//                 if (item.previous_volume === 0) {
//                     wowChange = item.current_volume > 0 ? 100 : 0;
//                 } else {
//                     wowChange = ((item.current_volume - item.previous_volume) / item.previous_volume) * 100;
//                 }
                
//                 return {
//                     keyword: item.keyword,
//                     wow_change: wowChange.toFixed(2) + '%',
//                     current_volume: item.current_volume,
//                     previous_volume: item.previous_volume
//                 };
//             })
//             // Filter for positive growth (trending up)
//             .filter(item => parseFloat(item.wow_change) > 0)
//             // Sort by WoW change descending
//             .sort((a, b) => parseFloat(b.wow_change) - parseFloat(a.wow_change))
//             .slice(0, 15);
        
//         response.status(200).json(trendingKeywords);
//     } catch (error) {
//         console.error('Failed to fetch trending keywords', error);
//         response.status(500).json({ error: 'Failed to fetch data' });
//     }
// }

// module.exports = { trendingKeywordService };







const { Op, fn, col } = require('sequelize');
const models = require('../models');

/**
 * trendingKeywordService
 * Query params:
 *  - startDate (ISO)  -> start of current window (inclusive)
 *  - endDate (ISO)    -> end of current window (inclusive)
 *
 * If not provided, defaults to last 7 days (current window).
 * Previous window is computed as the immediately preceding time window of equal length.
 *
 * Returns:
 *  [ { keyword, current_week_volume, previous_week_volume, wow_change } ]
 *  where wow_change is a numeric percent (2 decimal places)
 */
const trendingKeywordService = async (request, response) => {
  try {
    const { startDate, endDate } = request.query || {};

    let currentStart = null;
    let currentEnd = null;

    if (startDate && !isNaN(Date.parse(startDate))) currentStart = new Date(startDate);
    if (endDate && !isNaN(Date.parse(endDate))) {
      currentEnd = new Date(endDate);
      // make end inclusive to end of day
      currentEnd.setHours(23, 59, 59, 999);
    }

    // default to last 7 days if not provided
    if (!currentStart && !currentEnd) {
      const now = new Date();
      currentEnd = new Date(now);
      currentEnd.setHours(23, 59, 59, 999);
      currentStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      currentStart.setHours(0, 0, 0, 0);
    } else if (currentStart && !currentEnd) {
      // if only start provided assume 7-day window
      currentEnd = new Date(currentStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
    } else if (!currentStart && currentEnd) {
      // if only end provided assume 7-day window
      currentStart = new Date(currentEnd.getTime() - 7 * 24 * 60 * 60 * 1000 + 1);
      currentStart.setHours(0, 0, 0, 0);
    }

    // compute previous window immediately before current
    const windowMs = currentEnd.getTime() - currentStart.getTime() + 1;
    const previousEnd = new Date(currentStart.getTime() - 1);
    const previousStart = new Date(previousEnd.getTime() - (windowMs - 1));

    // Query current window volumes
    const currentWhere = {
      search_date: { [Op.gte]: currentStart, [Op.lte]: currentEnd },
      search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
    };

    const previousWhere = {
      search_date: { [Op.gte]: previousStart, [Op.lte]: previousEnd },
      search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
    };

    const currentWeekData = await models.Search.findAll({
      attributes: [['search_keyword', 'keyword'], [fn('COUNT', col('search_id')), 'current_week_volume']],
      where: currentWhere,
      group: ['search_keyword'],
      raw: true,
      subQuery: false
    });

    const previousWeekData = await models.Search.findAll({
      attributes: [['search_keyword', 'keyword'], [fn('COUNT', col('search_id')), 'previous_week_volume']],
      where: previousWhere,
      group: ['search_keyword'],
      raw: true,
      subQuery: false
    });

    // merge
    const map = new Map();

    currentWeekData.forEach(row => {
      const kw = String(row.keyword || '');
      map.set(kw, { keyword: kw, current_week_volume: Number(row.current_week_volume || 0), previous_week_volume: 0 });
    });

    previousWeekData.forEach(row => {
      const kw = String(row.keyword || '');
      if (map.has(kw)) {
        map.get(kw).previous_week_volume = Number(row.previous_week_volume || 0);
      } else {
        map.set(kw, { keyword: kw, current_week_volume: 0, previous_week_volume: Number(row.previous_week_volume || 0) });
      }
    });

    const result = Array.from(map.values()).map(item => {
      const cur = item.current_week_volume || 0;
      const prev = item.previous_week_volume || 0;
      let wow = 0;
      if (prev === 0) {
        wow = cur > 0 ? 100.0 : 0.0;
      } else {
        wow = ((cur - prev) / prev) * 100.0;
      }
      return {
        keyword: item.keyword,
        current_week_volume: cur,
        previous_week_volume: prev,
        wow_change: parseFloat(wow.toFixed(2))
      };
    })
    // Keep positive growth (trending up) only — this mirrors the UI focus on positive trends
    .filter(r => r.wow_change > 0)
    .sort((a, b) => b.wow_change - a.wow_change)
    .slice(0, 50);

    return response.status(200).json(result);
  } catch (error) {
    console.error('Failed to fetch trending keywords', error);
    return response.status(500).json({ error: 'Failed to fetch data' });
  }
};

module.exports = { trendingKeywordService };