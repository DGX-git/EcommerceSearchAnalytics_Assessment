// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const trendingKeywordService = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {trendingKeywordService};


var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const trendingKeywordService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Get current date
        const currentDate = new Date();
        
        // Calculate date ranges
        const currentWeekStart = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        const currentWeekEnd = currentDate;
        const previousWeekStart = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        const previousWeekEnd = currentWeekStart;
        
        // Query to get search volumes for current week
        const currentWeekData = await sequelize.query(`
            SELECT 
                search_keyword as keyword,
                COUNT(*) as current_week_volume
            FROM searches
            WHERE search_date >= :currentWeekStart
            AND search_date < :currentWeekEnd
            AND search_keyword IS NOT NULL
            AND search_keyword != ''
            GROUP BY search_keyword
        `, {
            replacements: { 
                currentWeekStart: currentWeekStart,
                currentWeekEnd: currentWeekEnd
            },
            type: sequelize.QueryTypes.SELECT
        });
        
        // Query to get search volumes for previous week
        const previousWeekData = await sequelize.query(`
            SELECT 
                search_keyword as keyword,
                COUNT(*) as previous_week_volume
            FROM searches
            WHERE search_date >= :previousWeekStart
            AND search_date < :previousWeekEnd
            AND search_keyword IS NOT NULL
            AND search_keyword != ''
            GROUP BY search_keyword
        `, {
            replacements: { 
                previousWeekStart: previousWeekStart,
                previousWeekEnd: previousWeekEnd
            },
            type: sequelize.QueryTypes.SELECT
        });
        
        // Merge and calculate WoW change
        const keywordMap = new Map();
        
        // Add current week data
        currentWeekData.forEach(item => {
            keywordMap.set(item.keyword, {
                keyword: item.keyword,
                current_volume: item.current_week_volume,
                previous_volume: 0
            });
        });
        
        // Add previous week data
        previousWeekData.forEach(item => {
            if (keywordMap.has(item.keyword)) {
                const existing = keywordMap.get(item.keyword);
                existing.previous_volume = item.previous_week_volume;
            } else {
                keywordMap.set(item.keyword, {
                    keyword: item.keyword,
                    current_volume: 0,
                    previous_volume: item.previous_week_volume
                });
            }
        });
        
        // Calculate WoW percentage change
        const trendingKeywords = Array.from(keywordMap.values())
            .map(item => {
                let wowChange = 0;
                if (item.previous_volume === 0) {
                    wowChange = item.current_volume > 0 ? 100 : 0;
                } else {
                    wowChange = ((item.current_volume - item.previous_volume) / item.previous_volume) * 100;
                }
                
                return {
                    keyword: item.keyword,
                    wow_change: wowChange.toFixed(2) + '%',
                    current_volume: item.current_volume,
                    previous_volume: item.previous_volume
                };
            })
            // Filter for positive growth (trending up)
            .filter(item => parseFloat(item.wow_change) > 0)
            // Sort by WoW change descending
            .sort((a, b) => parseFloat(b.wow_change) - parseFloat(a.wow_change))
            .slice(0, 15);
        
        response.status(200).json(trendingKeywords);
    } catch (error) {
        console.log('Failed to fetch trending keywords', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { trendingKeywordService };