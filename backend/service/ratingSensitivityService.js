// const models = require('../models');
// const { Op, fn, col, sequelize } = require('sequelize');

// /**
//  * Service to segment searches by rating sensitivity
//  * Categorizes: Low (≤2 stars), Medium (3-4 stars), High (5 stars)
//  * Uses Sequelize ORM with application-layer grouping and calculations
//  */
// const ratingSensitivityService = async(request, response) => {
//     try {
//         // Fetch all searches with valid ratings
//         const searches = await models.Search.findAll({
//             attributes: ['search_id', 'min_rating'],
//             where: {
//                 min_rating: {
//                     [Op.and]: [
//                         { [Op.ne]: null },
//                         { [Op.gte]: 0 }
//                     ]
//                 }
//             },
//             raw: true
//         });

//         // Get total count of valid searches for percentage calculation
//         const totalValidSearches = searches.length;

//         // Group and segment searches by rating sensitivity
//         const segments = {
//             'Low (≤2 stars)': { ratings: [], search_ids: new Set() },
//             'Medium (3-4 stars)': { ratings: [], search_ids: new Set() },
//             'High (5 stars)': { ratings: [], search_ids: new Set() }
//         };

//         searches.forEach(search => {
//             const rating = parseFloat(search.min_rating);
//             const searchId = search.search_id;

//             if (rating <= 2) {
//                 segments['Low (≤2 stars)'].ratings.push(rating);
//                 segments['Low (≤2 stars)'].search_ids.add(searchId);
//             } else if (rating > 2 && rating < 5) {
//                 segments['Medium (3-4 stars)'].ratings.push(rating);
//                 segments['Medium (3-4 stars)'].search_ids.add(searchId);
//             } else if (rating >= 5) {
//                 segments['High (5 stars)'].ratings.push(rating);
//                 segments['High (5 stars)'].search_ids.add(searchId);
//             }
//         });

//         // Calculate statistics for each segment
//         const result = Object.entries(segments)
//             .map(([range, data]) => {
//                 const searchCount = data.search_ids.size;
//                 const avgRating = data.ratings.length > 0
//                     ? parseFloat((data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(2))
//                     : 0;
//                 const percentage = totalValidSearches > 0
//                     ? parseFloat(((searchCount * 100.0 / totalValidSearches).toFixed(2)))
//                     : 0;

//                 return {
//                     rating_range: range,
//                     search_count: searchCount,
//                     avg_rating: avgRating,
//                     percentage
//                 };
//             })
//             .filter(item => item.search_count > 0)
//             .sort((a, b) => {
//                 const order = { 'Low (≤2 stars)': 1, 'Medium (3-4 stars)': 2, 'High (5 stars)': 3 };
//                 return (order[a.rating_range] || 4) - (order[b.rating_range] || 4);
//             });

//         response.status(200).json(result);
//     } catch (error) {
//         console.error('Failed to fetch rating sensitivity:', error);
//         response.status(500).json({ error: 'Failed to fetch rating sensitivity data' });
//     }
// };

// module.exports = { ratingSensitivityService };



// // backend/service/ratingSensitivityService.js
// const models = require('../models');
// const { Op } = require('sequelize');

// /**
//  * Service to compute rating sensitivity and per-keyword metrics
//  * Supports optional date filtering via ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
//  *
//  * Returns an array of objects containing:
//  *  - keyword
//  *  - avg_rating
//  *  - click_rate (percentage 0..100)
//  *  - conversion_rate (percentage 0..100)
//  *  - searches (count)
//  *
//  * If the SearchMetric model exists, it will be used to compute clicks/purchases per search.
//  */
// const ratingSensitivityService = async (request, response) => {
//   try {
//     const { startDate, endDate } = request.query || {};

//     const where = {
//       min_rating: {
//         [Op.and]: [{ [Op.ne]: null }]
//       }
//     };

//     if (startDate) where.search_date = { ...(where.search_date || {}), [Op.gte]: startDate };
//     if (endDate) where.search_date = { ...(where.search_date || {}), [Op.lte]: endDate };

//     // Fetch searches with keyword and rating
//     const searches = await models.Search.findAll({
//       attributes: ['search_id', 'search_keyword', 'min_rating'],
//       where,
//       raw: true
//     });

//     // Group by keyword
//     const keywordStats = {};
//     const allSearchIds = [];

//     searches.forEach(s => {
//       const k = (s.search_keyword || '').trim();
//       if (!k) return;
//       const key = k.toLowerCase();
//       if (!keywordStats[key]) {
//         keywordStats[key] = { keyword: k, ratings: [], search_ids: [] };
//       }
//       keywordStats[key].ratings.push(Number(s.min_rating ?? 0));
//       keywordStats[key].search_ids.push(s.search_id);
//       allSearchIds.push(s.search_id);
//     });

//     // Attempt to fetch metrics if model exists (search_metric)
//     const hasSearchMetric = !!models.SearchMetric;
//     const metricBySearchId = {};

//     if (hasSearchMetric && allSearchIds.length > 0) {
//       // Expect SearchMetric to have fields like clicks, purchases (adapt if names differ)
//       const metrics = await models.SearchMetric.findAll({
//         attributes: ['search_id', 'clicks', 'purchases', 'conversions'],
//         where: { search_id: allSearchIds },
//         raw: true
//       });

//       metrics.forEach(m => {
//         metricBySearchId[m.search_id] = m;
//       });
//     }

//     // Build results
//     const result = Object.values(keywordStats).map(k => {
//       const searchesCount = k.search_ids.length;
//       const avg_rating = k.ratings.length > 0 ? (k.ratings.reduce((a, b) => a + b, 0) / k.ratings.length) : 0;

//       // Sum clicks and conversions from metrics if available
//       let clicks = 0;
//       let purchases = 0;
//       if (hasSearchMetric) {
//         k.search_ids.forEach(id => {
//           const m = metricBySearchId[id];
//           if (m) {
//             clicks += Number(m.clicks ?? m.click_count ?? 0);
//             purchases += Number(m.purchases ?? m.purchase_count ?? m.conversions ?? 0);
//           }
//         });
//       }

//       const click_rate = searchesCount > 0 ? (clicks * 100.0 / searchesCount) : 0;
//       const conversion_rate = searchesCount > 0 ? (purchases * 100.0 / searchesCount) : 0;

//       return {
//         keyword: k.keyword,
//         avg_rating: parseFloat(avg_rating.toFixed(2)),
//         click_rate: parseFloat(click_rate.toFixed(2)),
//         conversion_rate: parseFloat(conversion_rate.toFixed(2)),
//         searches: searchesCount
//       };
//     });

//     // Sort descending by conversion_rate then clicks
//     result.sort((a, b) => b.conversion_rate - a.conversion_rate || b.click_rate - a.click_rate);

//     response.status(200).json(result);
//   } catch (error) {
//     console.error('Failed to fetch rating sensitivity:', error);
//     response.status(500).json({ error: 'Failed to fetch rating sensitivity data' });
//   }
// };

// module.exports = { ratingSensitivityService };







const models = require('../models');
const { Op } = require('sequelize');

/**
 * Service to compute rating sensitivity and per-keyword metrics
 * Supports optional date filtering via ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 *
 * Returns an array of objects containing:
 *  - keyword
 *  - avg_rating
 *  - click_rate (percentage 0..100)
 *  - conversion_rate (percentage 0..100)
 *  - searches (count)
 *
 * If the SearchMetric model exists, it will be used to compute clicks/purchases per search.
 * The code is defensive about which metric columns actually exist.
 */
const ratingSensitivityService = async (request, response) => {
  try {
    const { startDate, endDate } = request.query || {};

    const where = {
      min_rating: {
        [Op.and]: [{ [Op.ne]: null }]
      }
    };

    if (startDate) where.search_date = { ...(where.search_date || {}), [Op.gte]: startDate };
    if (endDate) where.search_date = { ...(where.search_date || {}), [Op.lte]: endDate };

    // Fetch searches with keyword and rating
    const searches = await models.Search.findAll({
      attributes: ['search_id', 'search_keyword', 'min_rating'],
      where,
      raw: true
    });

    // Group by keyword
    const keywordStats = {};
    const allSearchIds = [];

    searches.forEach(s => {
      const k = (s.search_keyword || '').trim();
      if (!k) return;
      const key = k.toLowerCase();
      if (!keywordStats[key]) {
        keywordStats[key] = { keyword: k, ratings: [], search_ids: [] };
      }
      keywordStats[key].ratings.push(Number(s.min_rating ?? 0));
      keywordStats[key].search_ids.push(s.search_id);
      allSearchIds.push(s.search_id);
    });

    // Deduplicate search IDs before querying metrics
    const uniqueSearchIds = Array.from(new Set(allSearchIds)).filter(id => id != null);

    // Attempt to fetch metrics if model exists (search_metric)
    const hasSearchMetric = !!models.SearchMetric;
    const metricBySearchId = {};

    if (hasSearchMetric && uniqueSearchIds.length > 0) {
      // Fetch all metric rows for these search IDs (do not request specific columns)
      const metrics = await models.SearchMetric.findAll({
        where: { search_id: uniqueSearchIds },
        raw: true
      });

      // Map metrics by search_id (there may be 1:1)
      metrics.forEach(m => {
        if (!m || m.search_id == null) return;
        metricBySearchId[m.search_id] = m;
      });
    }

    // Field name heuristics for clicks/purchases if present in SearchMetric rows
    const sumMetricField = (m, candidates) => {
      if (!m) return 0;
      for (const c of candidates) {
        if (Object.prototype.hasOwnProperty.call(m, c)) {
          const v = Number(m[c]);
          if (!Number.isNaN(v)) return v;
        }
      }
      return 0;
    };

    // Build results
    const result = Object.values(keywordStats).map(k => {
      const searchesCount = k.search_ids.length;
      const avg_rating = k.ratings.length > 0 ? (k.ratings.reduce((a, b) => a + b, 0) / k.ratings.length) : 0;

      // Sum clicks and purchases from metrics if available, defensively checking many possible field names
      let clicks = 0;
      let purchases = 0;

      if (hasSearchMetric) {
        k.search_ids.forEach(id => {
          const m = metricBySearchId[id];
          if (!m) return;

          // Common possible names for click-like metrics
          clicks += sumMetricField(m, [
            'clicks',
            'click_count',
            'clicks_count',
            'click_throughs',
            'click_through_count',
            'ctr_clicks'
          ]);

          // Common possible names for purchase/conversion-like metrics
          purchases += sumMetricField(m, [
            'purchases',
            'purchase_count',
            'purchase_count_total',
            'purchases_count',
            'conversions',
            'conversion_count',
            'orders',
            'order_count'
          ]);
        });
      }

      const click_rate = searchesCount > 0 ? (clicks * 100.0 / searchesCount) : 0;
      const conversion_rate = searchesCount > 0 ? (purchases * 100.0 / searchesCount) : 0;

      return {
        keyword: k.keyword,
        avg_rating: parseFloat(avg_rating.toFixed(2)),
        click_rate: parseFloat(click_rate.toFixed(2)),
        conversion_rate: parseFloat(conversion_rate.toFixed(2)),
        searches: searchesCount
      };
    });

    // Sort descending by conversion_rate then click_rate for visibility
    result.sort((a, b) => (b.conversion_rate - a.conversion_rate) || (b.click_rate - a.click_rate));

    response.status(200).json(result);
  } catch (error) {
    console.error('Failed to fetch rating sensitivity:', error);
    response.status(500).json({ error: 'Failed to fetch rating sensitivity data' });
  }
};

module.exports = { ratingSensitivityService };