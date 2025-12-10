var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const synonymMissesService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Define synonym mappings - keywords that should match but don't
        const synonymMappings = {
            'face lotion': ['moisturizer', 'cream', 'hydrating'],
            'lip moisturizer': ['lip balm', 'lip care'],
            'facial wash': ['cleanser', 'face wash', 'face soap'],
            'eye balm': ['eye cream', 'eye serum'],
            'pimple cream': ['acne treatment', 'blemish', 'spot treatment'],
            'skin toner': ['toner', 'essence'],
            'sunblock': ['sunscreen', 'spf'],
            'anti wrinkle': ['anti-aging', 'retinol'],
            'face exfoliator': ['exfoliant', 'mask'],
            'hydrating serum': ['serum', 'essence', 'treatment']
        };
        
        // Find searches with zero results
        const zeroResultSearches = await sequelize.query(`
            SELECT 
                search_keyword as keyword,
                COUNT(DISTINCT search_id) as miss_count
            FROM searches
            WHERE total_results = 0
            AND search_keyword IS NOT NULL
            AND search_keyword != ''
            GROUP BY search_keyword
            ORDER BY miss_count DESC
            LIMIT 50
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        // Check if similar products exist with synonym keywords
        const synonymMisses = [];
        
        for (const search of zeroResultSearches) {
            const keyword = search.keyword.toLowerCase();
            
            // Check if this keyword has defined synonyms
            for (const [searchTerm, synonyms] of Object.entries(synonymMappings)) {
                if (keyword.includes(searchTerm) || searchTerm.includes(keyword)) {
                    // Query to find if synonyms exist in successful searches
                    for (const synonym of synonyms) {
                        const synonymSearch = await sequelize.query(`
                            SELECT COUNT(DISTINCT search_id) as found_count
                            FROM searches
                            WHERE LOWER(search_keyword) LIKE '%' || :synonym || '%'
                            AND total_results > 0
                        `, {
                            replacements: { synonym: synonym },
                            type: sequelize.QueryTypes.SELECT
                        });
                        
                        if (synonymSearch[0].found_count > 0) {
                            synonymMisses.push({
                                keyword: search.keyword,
                                missed_variant: synonym,
                                miss_count: search.miss_count,
                                synonym_found: synonymSearch[0].found_count
                            });
                        }
                    }
                    break;
                }
            }
        }
        
        // Sort by miss count descending
        synonymMisses.sort((a, b) => b.miss_count - a.miss_count);
        
        response.status(200).json(synonymMisses.slice(0, 20));
    } catch (error) {
        console.log('Failed to fetch synonym misses', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { synonymMissesService };