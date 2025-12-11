const { Op, fn, col, where } = require('sequelize');
const models = require('../models');

const trendingKeywordService = async(request, response) => {
    try {
        // Get current date
        const currentDate = new Date();
        
        // Calculate date ranges
        const currentWeekStart = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        const currentWeekEnd = currentDate;
        const previousWeekStart = new Date(currentDate.getTime() - 14 * 24 * 60 * 60 * 1000);
        const previousWeekEnd = currentWeekStart;
        
        // Query to get search volumes for current week
        const currentWeekData = await models.Search.findAll({
            attributes: [
                ['search_keyword', 'keyword'],
                [fn('COUNT', col('search_id')), 'current_week_volume']
            ],
            where: {
                search_date: { [Op.gte]: currentWeekStart, [Op.lt]: currentWeekEnd },
                search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
            },
            group: ['search_keyword'],
            subQuery: false,
            raw: true
        });
        
        // Query to get search volumes for previous week
        const previousWeekData = await models.Search.findAll({
            attributes: [
                ['search_keyword', 'keyword'],
                [fn('COUNT', col('search_id')), 'previous_week_volume']
            ],
            where: {
                search_date: { [Op.gte]: previousWeekStart, [Op.lt]: previousWeekEnd },
                search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
            },
            group: ['search_keyword'],
            subQuery: false,
            raw: true
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
        console.error('Failed to fetch trending keywords', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { trendingKeywordService };
