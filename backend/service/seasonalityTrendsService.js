// const models = require('../models');
// const { Op, fn, col, sequelize } = require('sequelize');

// /**
//  * Service to analyze seasonality trends in search volume
//  * Groups search data by month and season (Winter, Spring, Summer, Fall)
//  * Uses Sequelize ORM with application-layer date grouping
//  */
// const seasonalityTrendsService = async(request, response) => {
//     try {
//         // Fetch all searches with dates
//         const searches = await models.Search.findAll({
//             attributes: ['search_id', 'search_date', 'customer_id', 'total_results', 'min_rating'],
//             where: {
//                 search_date: {
//                     [Op.ne]: null
//                 }
//             },
//             raw: true
//         });

//         // Helper function to get season from month
//         const getSeason = (month) => {
//             if ([12, 1, 2].includes(month)) return 'Winter';
//             if ([3, 4, 5].includes(month)) return 'Spring';
//             if ([6, 7, 8].includes(month)) return 'Summer';
//             if ([9, 10, 11].includes(month)) return 'Fall';
//             return 'Unknown';
//         };

//         // Helper function to get year-month string
//         const getYearMonth = (date) => {
//             const d = new Date(date);
//             const year = d.getFullYear();
//             const month = String(d.getMonth() + 1).padStart(2, '0');
//             return `${year}-${month}`;
//         };

//         // Group searches by month and season
//         const trendData = {};

//         searches.forEach(search => {
//             const date = new Date(search.search_date);
//             const month = date.getMonth() + 1;
//             const yearMonth = getYearMonth(search.search_date);
//             const season = getSeason(month);

//             const key = `${season}|${yearMonth}`;

//             if (!trendData[key]) {
//                 trendData[key] = {
//                     season,
//                     month: yearMonth,
//                     search_ids: new Set(),
//                     customer_ids: new Set(),
//                     results: [],
//                     ratings: []
//                 };
//             }

//             trendData[key].search_ids.add(search.search_id);
//             trendData[key].customer_ids.add(search.customer_id);
//             if (search.total_results != null) {
//                 trendData[key].results.push(parseFloat(search.total_results));
//             }
//             if (search.min_rating != null) {
//                 trendData[key].ratings.push(parseFloat(search.min_rating));
//             }
//         });

//         // Calculate metrics and prepare result
//         const result = Object.values(trendData)
//             .map(data => {
//                 const avgResults = data.results.length > 0
//                     ? parseFloat((data.results.reduce((a, b) => a + b, 0) / data.results.length).toFixed(2))
//                     : 0;
//                 const avgRating = data.ratings.length > 0
//                     ? parseFloat((data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(2))
//                     : 0;

//                 return {
//                     season: data.season,
//                     month: data.month,
//                     search_volume: data.search_ids.size,
//                     unique_customers: data.customer_ids.size,
//                     avg_results: avgResults,
//                     avg_rating: avgRating
//                 };
//             })
//             .sort((a, b) => b.month.localeCompare(a.month))
//             .slice(0, 24);

//         response.status(200).json(result);
//     } catch (error) {
//         console.error('Failed to fetch seasonality trends:', error);
//         response.status(500).json({ error: 'Failed to fetch seasonality trend data' });
//     }
// };

// module.exports = { seasonalityTrendsService };




const models = require('../models');
const { Op, fn, col } = require('sequelize');

/**
 * seasonalityTrendsService
 * Query params:
 *  - startDate (ISO) optional
 *  - endDate (ISO) optional
 *
 * Defaults: last 12 months (current window). Computes YoY by comparing each month
 * in the current window to the same month one year prior.
 *
 * Returns array of: { month: 'YYYY-MM', search_volume, yoy_change }  (yoy_change numeric %)
 */
const seasonalityTrendsService = async (request, response) => {
  try {
    const { startDate, endDate } = request.query || {};

    // Build current window
    let currentStart = null;
    let currentEnd = null;

    if (startDate && !isNaN(Date.parse(startDate))) currentStart = new Date(startDate);
    if (endDate && !isNaN(Date.parse(endDate))) {
      currentEnd = new Date(endDate);
      currentEnd.setHours(23, 59, 59, 999);
    }

    // Default to last 12 months if not provided
    const now = new Date();
    if (!currentStart && !currentEnd) {
      currentEnd = new Date(now);
      currentEnd.setHours(23, 59, 59, 999);
      // start at first day of month 11 months ago to get 12 months total
      const startMonth = new Date(currentEnd.getFullYear(), currentEnd.getMonth() - 11, 1);
      currentStart = new Date(startMonth);
      currentStart.setHours(0, 0, 0, 0);
    } else if (currentStart && !currentEnd) {
      // if only start provided assume 12 month window
      currentEnd = new Date(currentStart.getTime());
      currentEnd.setMonth(currentEnd.getMonth() + 12);
      currentEnd.setDate(0); // last day of previous month
      currentEnd.setHours(23, 59, 59, 999);
    } else if (!currentStart && currentEnd) {
      // if only end provided assume 12 month window ending at end
      currentStart = new Date(currentEnd.getFullYear(), currentEnd.getMonth() - 11, 1);
      currentStart.setHours(0, 0, 0, 0);
    }

    // compute previous window (same months previous year)
    const previousStart = new Date(currentStart);
    previousStart.setFullYear(previousStart.getFullYear() - 1);
    const previousEnd = new Date(currentEnd);
    previousEnd.setFullYear(previousEnd.getFullYear() - 1);

    // Helper: group by month string 'YYYY-MM' using to_char (Postgres)
    const monthExpr = fn('to_char', col('search_date'), 'YYYY-MM');

    // Query current window aggregated by month
    const currentRows = await models.Search.findAll({
      attributes: [[monthExpr, 'month'], [fn('COUNT', col('search_id')), 'search_volume']],
      where: {
        search_date: { [Op.gte]: currentStart, [Op.lte]: currentEnd },
        search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
      },
      group: ['month'],
      order: [['month', 'ASC']],
      raw: true,
      subQuery: false
    });

    // Query previous window aggregated by month
    const previousRows = await models.Search.findAll({
      attributes: [[fn('to_char', col('search_date'), 'YYYY-MM'), 'month'], [fn('COUNT', col('search_id')), 'search_volume']],
      where: {
        search_date: { [Op.gte]: previousStart, [Op.lte]: previousEnd },
        search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
      },
      group: ['month'],
      raw: true,
      subQuery: false
    });

    // Build map for previous rows keyed by month (YYYY-MM)
    const prevMap = {};
    previousRows.forEach(r => {
      // r.month is 'YYYY-MM' for previous year (e.g. '2024-03')
      prevMap[String(r.month)] = Number(r.search_volume || 0);
    });

    // For each current month compute YoY using the same month previous year
    const out = currentRows.map(r => {
      const month = String(r.month); // e.g. '2025-03'
      const cur = Number(r.search_volume || 0);

      // compute previous-month key (subtract one year)
      const parts = month.split('-');
      let prevKey = month;
      if (parts.length === 2) {
        const year = parseInt(parts[0], 10);
        const mon = parts[1];
        prevKey = `${year - 1}-${mon}`;
      }

      const prev = Number(prevMap[prevKey] || 0);
      let yoy = 0;
      if (prev === 0) {
        yoy = cur > 0 ? 100.0 : 0.0;
      } else {
        yoy = ((cur - prev) / prev) * 100.0;
      }

      return {
        month,
        search_volume: cur,
        yoy_change: parseFloat(yoy.toFixed(2))
      };
    });

    // Sort by month ascending
    out.sort((a, b) => a.month.localeCompare(b.month));

    return response.status(200).json(out);
  } catch (error) {
    console.error('Failed to fetch seasonality trends:', error);
    return response.status(500).json({ error: 'Failed to fetch seasonality trend data' });
  }
};

module.exports = { seasonalityTrendsService };