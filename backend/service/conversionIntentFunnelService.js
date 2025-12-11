// const models = require('../models');
// const { Op, sequelize } = require('sequelize');

// /**
//  * Service to track search-to-purchase conversion funnel
//  * Stages: Search → Product View → Add to Cart → Purchase
//  * Uses Sequelize ORM with application-layer funnel stage classification
//  */
// const conversionIntentFunnelService = async(request, response) => {
//     try {
//         // Fetch all valid searches
//         const searches = await models.Search.findAll({
//             attributes: ['search_id', 'search_keyword', 'customer_id', 'total_results', 'max_price', 'min_rating'],
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

//         // Classify searches into funnel stages
//         const stageMetrics = {
//             'Search': { search_ids: new Set(), customer_ids: new Set() },
//             'Product View': { search_ids: new Set(), customer_ids: new Set() },
//             'Add to Cart': { search_ids: new Set(), customer_ids: new Set() },
//             'Purchase': { search_ids: new Set(), customer_ids: new Set() }
//         };

//         // First pass: identify repeat customers (3+ searches)
//         const customerSearchCounts = {};
//         searches.forEach(search => {
//             const customerId = search.customer_id;
//             if (!customerSearchCounts[customerId]) {
//                 customerSearchCounts[customerId] = 0;
//             }
//             customerSearchCounts[customerId]++;
//         });

//         // Classify each search into appropriate funnel stage
//         searches.forEach(search => {
//             const customerId = search.customer_id;
            
//             // Stage 1: All searches
//             stageMetrics['Search'].search_ids.add(search.search_id);
//             stageMetrics['Search'].customer_ids.add(customerId);

//             // Stage 2: Product View - search returned results
//             if (search.total_results > 0) {
//                 stageMetrics['Product View'].search_ids.add(search.search_id);
//                 stageMetrics['Product View'].customer_ids.add(customerId);

//                 // Stage 3: Add to Cart - has price and good rating
//                 if (search.max_price > 0 && search.min_rating >= 3) {
//                     stageMetrics['Add to Cart'].search_ids.add(search.search_id);
//                     stageMetrics['Add to Cart'].customer_ids.add(customerId);

//                     // Stage 4: Purchase - returning customer (3+ searches)
//                     if (customerSearchCounts[customerId] >= 3) {
//                         stageMetrics['Purchase'].search_ids.add(search.search_id);
//                         stageMetrics['Purchase'].customer_ids.add(customerId);
//                     }
//                 }
//             }
//         });

//         // Prepare aggregate funnel response
//         const aggregateFunnel = [
//             {
//                 stage: 'Search',
//                 count: stageMetrics['Search'].search_ids.size,
//                 user_count: stageMetrics['Search'].customer_ids.size
//             },
//             {
//                 stage: 'Product View',
//                 count: stageMetrics['Product View'].search_ids.size,
//                 user_count: stageMetrics['Product View'].customer_ids.size
//             },
//             {
//                 stage: 'Add to Cart',
//                 count: stageMetrics['Add to Cart'].search_ids.size,
//                 user_count: stageMetrics['Add to Cart'].customer_ids.size
//             },
//             {
//                 stage: 'Purchase',
//                 count: stageMetrics['Purchase'].search_ids.size,
//                 user_count: stageMetrics['Purchase'].customer_ids.size
//             }
//         ];

//         // Group by keyword for per-keyword funnel breakdown
//         const keywordFunnels = {};
//         searches.forEach(search => {
//             const keyword = search.search_keyword;
//             const customerId = search.customer_id;

//             if (!keywordFunnels[keyword]) {
//                 keywordFunnels[keyword] = {
//                     keyword,
//                     searches: new Set(),
//                     views: new Set(),
//                     add_to_cart: new Set(),
//                     purchases: new Set(),
//                     unique_users: new Set()
//                 };
//             }

//             keywordFunnels[keyword].searches.add(search.search_id);
//             keywordFunnels[keyword].unique_users.add(customerId);

//             if (search.total_results > 0) {
//                 keywordFunnels[keyword].views.add(search.search_id);

//                 if (search.max_price > 0 && search.min_rating >= 3) {
//                     keywordFunnels[keyword].add_to_cart.add(search.search_id);

//                     if (customerSearchCounts[customerId] >= 3) {
//                         keywordFunnels[keyword].purchases.add(search.search_id);
//                     }
//                 }
//             }
//         });

//         // Calculate per-keyword funnel metrics
//         const keywordFunnel = Object.values(keywordFunnels)
//             .map(kf => {
//                 const searches = kf.searches.size;
//                 const views = kf.views.size;
//                 const cartItems = kf.add_to_cart.size;
//                 const purchases = kf.purchases.size;

//                 return {
//                     keyword: kf.keyword,
//                     searches,
//                     views,
//                     add_to_cart: cartItems,
//                     purchases,
//                     unique_users: kf.unique_users.size,
//                     view_rate: searches > 0 ? parseFloat(((views * 100.0 / searches).toFixed(2))) : 0,
//                     cart_rate: searches > 0 ? parseFloat(((cartItems * 100.0 / searches).toFixed(2))) : 0,
//                     purchase_rate: searches > 0 ? parseFloat(((purchases * 100.0 / searches).toFixed(2))) : 0
//                 };
//             })
//             .sort((a, b) => b.searches - a.searches)
//             .slice(0, 50);

//         // Return both aggregate and keyword-level data
//         const responseData = {
//             aggregateFunnel,
//             keywordFunnel
//         };

//         response.status(200).json(responseData);
//     } catch (error) {
//         console.error('Failed to fetch conversion intent funnel:', error);
//         response.status(500).json({ error: 'Failed to fetch funnel data' });
//     }
// };

// module.exports = { conversionIntentFunnelService };




// backend/service/conversionIntentFunnelService.js
const models = require('../models');
const { Op } = require('sequelize');

/**
 * Service to track search-to-purchase conversion funnel
 * Stages: Search → Product View → Add to Cart → Purchase
 */
const conversionIntentFunnelService = async (request, response) => {
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

    // Fetch searches with date filter if provided
    const searches = await models.Search.findAll({
      attributes: ['search_id', 'search_keyword', 'customer_id', 'total_results', 'max_price', 'min_rating', 'search_date'],
      where,
      raw: true
    });

    // (rest of original logic unchanged)
    const stageMetrics = {
      'Search': { search_ids: new Set(), customer_ids: new Set() },
      'Product View': { search_ids: new Set(), customer_ids: new Set() },
      'Add to Cart': { search_ids: new Set(), customer_ids: new Set() },
      'Purchase': { search_ids: new Set(), customer_ids: new Set() }
    };

    const customerSearchCounts = {};
    searches.forEach(search => {
      const customerId = search.customer_id;
      if (!customerSearchCounts[customerId]) {
        customerSearchCounts[customerId] = 0;
      }
      customerSearchCounts[customerId]++;
    });

    searches.forEach(search => {
      const customerId = search.customer_id;

      stageMetrics['Search'].search_ids.add(search.search_id);
      stageMetrics['Search'].customer_ids.add(customerId);

      if (search.total_results > 0) {
        stageMetrics['Product View'].search_ids.add(search.search_id);
        stageMetrics['Product View'].customer_ids.add(customerId);

        if (search.max_price > 0 && (search.min_rating ?? 0) >= 3) {
          stageMetrics['Add to Cart'].search_ids.add(search.search_id);
          stageMetrics['Add to Cart'].customer_ids.add(customerId);

          if ((customerSearchCounts[customerId] ?? 0) >= 3) {
            stageMetrics['Purchase'].search_ids.add(search.search_id);
            stageMetrics['Purchase'].customer_ids.add(customerId);
          }
        }
      }
    });

    const aggregateFunnel = [
      { stage: 'Search', count: stageMetrics['Search'].search_ids.size, user_count: stageMetrics['Search'].customer_ids.size },
      { stage: 'Product View', count: stageMetrics['Product View'].search_ids.size, user_count: stageMetrics['Product View'].customer_ids.size },
      { stage: 'Add to Cart', count: stageMetrics['Add to Cart'].search_ids.size, user_count: stageMetrics['Add to Cart'].customer_ids.size },
      { stage: 'Purchase', count: stageMetrics['Purchase'].search_ids.size, user_count: stageMetrics['Purchase'].customer_ids.size },
    ];

    const keywordFunnels = {};
    searches.forEach(search => {
      const keyword = search.search_keyword || '';
      const customerId = search.customer_id;

      if (!keywordFunnels[keyword]) {
        keywordFunnels[keyword] = {
          keyword,
          searches: new Set(),
          views: new Set(),
          add_to_cart: new Set(),
          purchases: new Set(),
          unique_users: new Set()
        };
      }

      keywordFunnels[keyword].searches.add(search.search_id);
      keywordFunnels[keyword].unique_users.add(customerId);

      if (search.total_results > 0) {
        keywordFunnels[keyword].views.add(search.search_id);

        if (search.max_price > 0 && (search.min_rating ?? 0) >= 3) {
          keywordFunnels[keyword].add_to_cart.add(search.search_id);

          if ((customerSearchCounts[customerId] ?? 0) >= 3) {
            keywordFunnels[keyword].purchases.add(search.search_id);
          }
        }
      }
    });

    const keywordFunnel = Object.values(keywordFunnels)
      .map(kf => ({
        keyword: kf.keyword,
        searches: kf.searches.size,
        views: kf.views.size,
        add_to_cart: kf.add_to_cart.size,
        purchases: kf.purchases.size,
        unique_users: kf.unique_users.size
      }))
      .sort((a, b) => b.searches - a.searches)
      .slice(0, 200);

    response.status(200).json({ aggregateFunnel, keywordFunnel });
  } catch (error) {
    console.error('Failed to fetch conversion intent funnel:', error);
    response.status(500).json({ error: 'Failed to fetch funnel data' });
  }
};

module.exports = { conversionIntentFunnelService };