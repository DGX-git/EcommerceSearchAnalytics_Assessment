// const models = require('../models');
// const { Op, sequelize } = require('sequelize');

// /**
//  * Service to calculate search-to-cart conversion rates by keyword
//  * Conversion indicators: positive results, mid-range pricing, good ratings (>=3)
//  * Uses Sequelize ORM with application-layer filtering and calculations
//  */
// const searchAddToCartConversionService = async(request, response) => {
//     try {
//         // Fetch searches with positive results
//         const searches = await models.Search.findAll({
//             attributes: ['search_id', 'search_keyword', 'customer_id', 'total_results', 'max_price', 'min_rating'],
//             where: {
//                 search_keyword: {
//                     [Op.and]: [
//                         { [Op.ne]: null },
//                         { [Op.ne]: '' }
//                     ]
//                 },
//                 total_results: {
//                     [Op.gt]: 0
//                 }
//             },
//             raw: true
//         });

//         // Group by keyword and calculate conversion metrics
//         const keywordStats = {};

//         searches.forEach(search => {
//             const keyword = search.search_keyword;
            
//             // Check if search meets conversion criteria
//             const isConverted = search.total_results > 0 && 
//                               search.max_price > 0 && 
//                               search.min_rating >= 3;

//             if (!keywordStats[keyword]) {
//                 keywordStats[keyword] = {
//                     total_searches: 0,
//                     converted_searches: 0,
//                     customer_ids: new Set(),
//                     search_ids: new Set()
//                 };
//             }

//             keywordStats[keyword].total_searches++;
//             keywordStats[keyword].search_ids.add(search.search_id);
//             keywordStats[keyword].customer_ids.add(search.customer_id);
            
//             if (isConverted) {
//                 keywordStats[keyword].converted_searches++;
//             }
//         });

//         // Calculate conversion rates and filter results
//         const result = Object.entries(keywordStats)
//             .filter(([_, stats]) => stats.total_searches >= 2) // HAVING COUNT >= 2
//             .map(([keyword, stats]) => ({
//                 keyword,
//                 total_searches: stats.total_searches,
//                 unique_customers: stats.customer_ids.size,
//                 conversion_rate: parseFloat(((stats.converted_searches * 100.0 / stats.total_searches).toFixed(2)))
//             }))
//             .sort((a, b) => b.conversion_rate - a.conversion_rate)
//             .slice(0, 20);

//         response.status(200).json(result);
//     } catch (error) {
//         console.error('Failed to fetch search add to cart conversion:', error);
//         response.status(500).json({ error: 'Failed to fetch conversion data' });
//     }
// };

// module.exports = { searchAddToCartConversionService };



const models = require('../models');
const { Op, sequelize } = require('sequelize');

/**
 * Service to calculate search-to-cart conversion rates by keyword
 * Conversion indicators: positive results, mid-range pricing, good ratings (>=3)
 * Uses Sequelize ORM with application-layer filtering and calculations
 */
const searchAddToCartConversionService = async(request, response) => {
    try {
        // Fetch searches with positive results
        const searches = await models.Search.findAll({
            attributes: ['search_id', 'search_keyword', 'customer_id', 'total_results', 'max_price', 'min_rating'],
            where: {
                search_keyword: {
                    [Op.and]: [
                        { [Op.ne]: null },
                        { [Op.ne]: '' }
                    ]
                },
                total_results: {
                    [Op.gt]: 0
                }
            },
            raw: true
        });

        // Group by keyword and calculate conversion metrics
        const keywordStats = {};

        searches.forEach(search => {
            const keyword = search.search_keyword;
            
            // Check if search meets conversion criteria
            const isConverted = search.total_results > 0 && 
                              search.max_price > 0 && 
                              search.min_rating >= 3;

            if (!keywordStats[keyword]) {
                keywordStats[keyword] = {
                    total_searches: 0,
                    converted_searches: 0,
                    customer_ids: new Set(),
                    search_ids: new Set()
                };
            }

            keywordStats[keyword].total_searches++;
            keywordStats[keyword].search_ids.add(search.search_id);
            keywordStats[keyword].customer_ids.add(search.customer_id);
            
            if (isConverted) {
                keywordStats[keyword].converted_searches++;
            }
        });

        // Calculate conversion rates and filter results
        const result = Object.entries(keywordStats)
            .filter(([_, stats]) => stats.total_searches >= 2) // HAVING COUNT >= 2
            .map(([keyword, stats]) => ({
                keyword,
                total_searches: stats.total_searches,
                unique_customers: stats.customer_ids.size,
                conversion_rate: parseFloat(((stats.converted_searches * 100.0 / stats.total_searches).toFixed(2)))
            }))
            .sort((a, b) => b.conversion_rate - a.conversion_rate)
            .slice(0, 20);

        response.status(200).json(result);
    } catch (error) {
        console.error('Failed to fetch search add to cart conversion:', error);
        response.status(500).json({ error: 'Failed to fetch conversion data' });
    }
};

module.exports = { searchAddToCartConversionService };