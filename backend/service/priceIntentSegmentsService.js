// const models = require('../models');
// const { Op, fn, col, sequelize } = require('sequelize');

// /**
//  * Service to segment searches by price intent ranges
//  * Categorizes: Budget (≤$50), Mid-range ($51-$200), Premium (>$200)
//  * Uses Sequelize ORM for database queries and application-layer transformations
//  */
// const priceIntentSegmentService = async(request, response) => {
//     try {
//         // Fetch all searches with max_price > 0
//         const searches = await models.Search.findAll({
//             attributes: ['search_id', 'max_price'],
//             where: {
//                 max_price: {
//                     [Op.gt]: 0
//                 }
//             },
//             raw: true
//         });

//         // Transform and segment data in application layer
//         const segments = {
//             'Budget (≤$50)': { count: 0, prices: [] },
//             'Mid-range ($51-$200)': { count: 0, prices: [] },
//             'Premium (>$200)': { count: 0, prices: [] }
//         };

//         searches.forEach(search => {
//             const price = parseFloat(search.max_price);
//             if (price <= 50) {
//                 segments['Budget (≤$50)'].count++;
//                 segments['Budget (≤$50)'].prices.push(price);
//             } else if (price > 50 && price <= 200) {
//                 segments['Mid-range ($51-$200)'].count++;
//                 segments['Mid-range ($51-$200)'].prices.push(price);
//             } else {
//                 segments['Premium (>$200)'].count++;
//                 segments['Premium (>$200)'].prices.push(price);
//             }
//         });

//         // Calculate statistics for each segment
//         const result = Object.entries(segments)
//             .map(([segment, data]) => ({
//                 price_segment: segment,
//                 segment_count: data.count,
//                 avg_max_price: data.prices.length > 0 
//                     ? parseFloat((data.prices.reduce((a, b) => a + b, 0) / data.prices.length).toFixed(2))
//                     : 0,
//                 min_price: data.prices.length > 0 ? Math.min(...data.prices) : 0,
//                 max_price: data.prices.length > 0 ? Math.max(...data.prices) : 0
//             }))
//             .filter(item => item.segment_count > 0);

//         response.status(200).json(result);
//     } catch (error) {
//         console.error('Failed to fetch price intent segments:', error);
//         response.status(500).json({ error: 'Failed to fetch price intent segment data' });
//     }
// };

// module.exports = { priceIntentSegmentService };



// backend/service/priceIntentSegmentsService.js
const models = require('../models');
const { Op } = require('sequelize');

/**
 * Service to segment searches by price intent ranges
 * Categorizes: Budget (≤$50), Mid-range ($51-$200), Premium (>$200)
 * Supports optional date filtering via ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
const priceIntentSegmentService = async (request, response) => {
  try {
    const { startDate, endDate } = request.query || {};

    // Build where clause; require max_price > 0 (same as original)
    const where = {
      max_price: { [Op.gt]: 0 }
    };

    if (startDate) where.search_date = { ...(where.search_date || {}), [Op.gte]: startDate };
    if (endDate) where.search_date = { ...(where.search_date || {}), [Op.lte]: endDate };

    // Fetch searches (include search_keyword to compute unique keywords)
    const searches = await models.Search.findAll({
      attributes: ['search_id', 'search_keyword', 'max_price', 'search_date'],
      where,
      raw: true
    });

    // Prepare segments with keyword sets
    const segments = {
      'Budget (≤$50)': { count: 0, prices: [], keywords: new Set() },
      'Mid-range ($51-$200)': { count: 0, prices: [], keywords: new Set() },
      'Premium (>$200)': { count: 0, prices: [], keywords: new Set() }
    };

    searches.forEach(search => {
      const price = parseFloat(search.max_price) || 0;
      const keyword = (search.search_keyword || '').trim();
      let segKey = 'Other';
      if (price <= 50) segKey = 'Budget (≤$50)';
      else if (price > 50 && price <= 200) segKey = 'Mid-range ($51-$200)';
      else segKey = 'Premium (>$200)';

      if (!segments[segKey]) {
        segments[segKey] = { count: 0, prices: [], keywords: new Set() };
      }

      segments[segKey].count++;
      segments[segKey].prices.push(price);
      if (keyword) segments[segKey].keywords.add(keyword.toLowerCase());
    });

    // Build result: price_segment | keyword_count | search_volume (+ extras)
    const result = Object.entries(segments)
      .map(([segment, data]) => {
        const prices = data.prices || [];
        const avg = prices.length > 0 ? parseFloat((prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)) : 0;
        return {
          price_segment: segment,
          keyword_count: (data.keywords && data.keywords.size) ? data.keywords.size : 0,
          search_volume: data.count || 0,
          avg_max_price: avg,
          min_price: prices.length > 0 ? Math.min(...prices) : 0,
          max_price: prices.length > 0 ? Math.max(...prices) : 0
        };
      })
      // keep ordering: Budget, Mid-range, Premium
      .sort((a, b) => {
        const order = ['Budget (≤$50)', 'Mid-range ($51-$200)', 'Premium (>$200)'];
        return order.indexOf(a.price_segment) - order.indexOf(b.price_segment);
      });

    response.status(200).json(result);
  } catch (error) {
    console.error('Failed to fetch price intent segments:', error);
    response.status(500).json({ error: 'Failed to fetch price intent segment data' });
  }
};

module.exports = { priceIntentSegmentService };