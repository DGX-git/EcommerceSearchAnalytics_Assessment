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