// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const conversionIntentFunnelService = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {conversionIntentFunnelService};



// var express = require('express');
// var router = express.Router();
// var sequelize = require('../config/sequelize.config');

// const conversionIntentFunnelService = async(request, response) => {
//     try {
//         await sequelize.sync();
        
//         // Stage 1: All Searches
//         const searchStage = await sequelize.query(`
//             SELECT COUNT(DISTINCT search_id) as count
//             FROM searches
//             WHERE search_keyword IS NOT NULL
//             AND search_keyword != ''
//         `, {
//             type: sequelize.QueryTypes.SELECT
//         });
        
//         // Stage 2: Product Views (searches with results > 0)
//         const productViewStage = await sequelize.query(`
//             SELECT COUNT(DISTINCT search_id) as count
//             FROM searches
//             WHERE search_keyword IS NOT NULL
//             AND search_keyword != ''
//             AND total_results > 0
//         `, {
//             type: sequelize.QueryTypes.SELECT
//         });
        
//         // Stage 3: Add to Cart Intent (searches with good results, pricing, and ratings)
//         // Indicators: results > 0, price range set, rating >= 3
//         const addToCartStage = await sequelize.query(`
//             SELECT COUNT(DISTINCT search_id) as count
//             FROM searches
//             WHERE search_keyword IS NOT NULL
//             AND search_keyword != ''
//             AND total_results > 0
//             AND max_price > 0
//             AND max_rating >= 3
//         `, {
//             type: sequelize.QueryTypes.SELECT
//         });
        
//         // Stage 4: Purchase Intent (repeat searches by same customer - high intent)
//         // Customers searching 3+ times for same/similar products likely to purchase
//         const purchaseIntentStage = await sequelize.query(`
//             SELECT COUNT(DISTINCT search_id) as count
//             FROM searches
//             WHERE search_keyword IS NOT NULL
//             AND search_keyword != ''
//             AND total_results > 0
//             AND max_price > 0
//             AND max_rating >= 3
//             AND customer_id IN (
//                 SELECT customer_id
//                 FROM searches
//                 GROUP BY customer_id
//                 HAVING COUNT(*) >= 3
//             )
//         `, {
//             type: sequelize.QueryTypes.SELECT
//         });
        
//         // Calculate conversion percentages
//         const totalSearches = searchStage[0].count || 0;
        
//         const funnelData = [
//             {
//                 stage: 'Search',
//                 count: totalSearches,
//                 percentage: 100
//             },
//             {
//                 stage: 'Product View',
//                 count: productViewStage[0].count || 0,
//                 percentage: totalSearches > 0 ? Math.round((productViewStage[0].count / totalSearches) * 100) : 0
//             },
//             {
//                 stage: 'Add to Cart',
//                 count: addToCartStage[0].count || 0,
//                 percentage: totalSearches > 0 ? Math.round((addToCartStage[0].count / totalSearches) * 100) : 0
//             },
//             {
//                 stage: 'Purchase Intent',
//                 count: purchaseIntentStage[0].count || 0,
//                 percentage: totalSearches > 0 ? Math.round((purchaseIntentStage[0].count / totalSearches) * 100) : 0
//             }
//         ];
        
//         response.status(200).json(funnelData);
//     } catch (error) {
//         console.log('Failed to fetch conversion intent funnel', error);
//         response.status(500).json({ error: 'Failed to fetch data' });
//     }
// }

// module.exports = { conversionIntentFunnelService };



var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const conversionIntentFunnelService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Get aggregate funnel data with user counts
        const aggregateFunnel = await sequelize.query(`
            SELECT 
                'Search' as stage,
                COUNT(DISTINCT search_id) as count,
                COUNT(DISTINCT customer_id) as user_count
            FROM searches
            WHERE search_keyword IS NOT NULL
            AND search_keyword != ''
            
            UNION ALL
            
            SELECT 
                'Product View' as stage,
                COUNT(DISTINCT search_id) as count,
                COUNT(DISTINCT customer_id) as user_count
            FROM searches
            WHERE search_keyword IS NOT NULL
            AND search_keyword != ''
            AND total_results > 0
            
            UNION ALL
            
            SELECT 
                'Add to Cart' as stage,
                COUNT(DISTINCT search_id) as count,
                COUNT(DISTINCT customer_id) as user_count
            FROM searches
            WHERE search_keyword IS NOT NULL
            AND search_keyword != ''
            AND total_results > 0
            AND max_price > 0
            AND max_rating >= 3
            
            UNION ALL
            
            SELECT 
                'Purchase' as stage,
                COUNT(DISTINCT search_id) as count,
                COUNT(DISTINCT customer_id) as user_count
            FROM searches
            WHERE search_keyword IS NOT NULL
            AND search_keyword != ''
            AND total_results > 0
            AND max_price > 0
            AND max_rating >= 3
            AND customer_id IN (
                SELECT customer_id
                FROM searches
                GROUP BY customer_id
                HAVING COUNT(*) >= 3
            )
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        // Get per-keyword funnel breakdown
        const keywordFunnel = await sequelize.query(`
            SELECT
                s.search_keyword as keyword,
                COUNT(DISTINCT CASE WHEN 1=1 THEN s.search_id END) as searches,
                COUNT(DISTINCT CASE WHEN s.total_results > 0 THEN s.search_id END) as views,
                COUNT(DISTINCT CASE WHEN s.total_results > 0 AND s.max_price > 0 AND s.max_rating >= 3 THEN s.search_id END) as add_to_cart,
                COUNT(DISTINCT CASE 
                    WHEN s.total_results > 0 AND s.max_price > 0 AND s.max_rating >= 3 
                    AND s.customer_id IN (
                        SELECT customer_id
                        FROM searches
                        GROUP BY customer_id
                        HAVING COUNT(*) >= 3
                    )
                    THEN s.search_id 
                END) as purchases,
                COUNT(DISTINCT s.customer_id) as unique_users,
                ROUND(
                    COUNT(DISTINCT CASE WHEN s.total_results > 0 THEN s.search_id END) * 100.0 
                    / NULLIF(COUNT(DISTINCT s.search_id), 0), 2
                ) as view_rate,
                ROUND(
                    COUNT(DISTINCT CASE WHEN s.total_results > 0 AND s.max_price > 0 AND s.max_rating >= 3 THEN s.search_id END) * 100.0 
                    / NULLIF(COUNT(DISTINCT s.search_id), 0), 2
                ) as cart_rate,
                ROUND(
                    COUNT(DISTINCT CASE 
                        WHEN s.total_results > 0 AND s.max_price > 0 AND s.max_rating >= 3 
                        AND s.customer_id IN (
                            SELECT customer_id
                            FROM searches
                            GROUP BY customer_id
                            HAVING COUNT(*) >= 3
                        )
                        THEN s.search_id 
                    END) * 100.0 
                    / NULLIF(COUNT(DISTINCT s.search_id), 0), 2
                ) as purchase_rate
            FROM searches s
            WHERE s.search_keyword IS NOT NULL
            AND s.search_keyword != ''
            GROUP BY s.search_keyword
            ORDER BY searches DESC
            LIMIT 50
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        // Return both aggregate and keyword-level data
        const response_data = [aggregateFunnel, keywordFunnel];
        response.status(200).json(response_data);
    } catch (error) {
        console.log('Failed to fetch conversion intent funnel', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { conversionIntentFunnelService };