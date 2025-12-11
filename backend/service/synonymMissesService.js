const models = require('../models');
const { Op, sequelize } = require('sequelize');

/**
 * Service to find zero-result searches that have synonyms with successful results
 * Identifies missed search opportunities due to lack of synonym handling
 * Uses Sequelize ORM with application-layer synonym matching logic
 */
const synonymMissesService = async(request, response) => {
    try {
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

        // Fetch zero-result searches
        const zeroResultSearches = await models.Search.findAll({
            attributes: ['search_id', 'search_keyword'],
            where: {
                total_results: 0,
                search_keyword: {
                    [Op.and]: [
                        { [Op.ne]: null },
                        { [Op.ne]: '' }
                    ]
                }
            },
            raw: true
        });

        // Group zero-result searches by keyword
        const keywordGroups = {};
        zeroResultSearches.forEach(search => {
            const keyword = search.search_keyword;
            if (!keywordGroups[keyword]) {
                keywordGroups[keyword] = 0;
            }
            keywordGroups[keyword]++;
        });

        // Fetch all searches with results for synonym matching
        const successfulSearches = await models.Search.findAll({
            attributes: ['search_keyword'],
            where: {
                total_results: {
                    [Op.gt]: 0
                },
                search_keyword: {
                    [Op.and]: [
                        { [Op.ne]: null },
                        { [Op.ne]: '' }
                    ]
                }
            },
            raw: true
        });

        const successfulKeywords = new Set(
            successfulSearches.map(s => s.search_keyword.toLowerCase())
        );

        // Find synonym misses
        const synonymMisses = [];

        for (const [missedKeyword, missCount] of Object.entries(keywordGroups)) {
            const lowerMissed = missedKeyword.toLowerCase();

            // Check if this keyword has defined synonyms
            for (const [searchTerm, synonyms] of Object.entries(synonymMappings)) {
                if (lowerMissed.includes(searchTerm) || searchTerm.includes(lowerMissed)) {
                    // Check each synonym
                    for (const synonym of synonyms) {
                        const lowerSynonym = synonym.toLowerCase();
                        
                        // Check if any successful search contains this synonym
                        const hasSynonym = Array.from(successfulKeywords).some(
                            keyword => keyword.includes(lowerSynonym) || lowerSynonym.includes(keyword)
                        );

                        if (hasSynonym) {
                            const synonymFoundCount = Array.from(successfulKeywords).filter(
                                keyword => keyword.includes(lowerSynonym) || lowerSynonym.includes(keyword)
                            ).length;

                            synonymMisses.push({
                                keyword: missedKeyword,
                                missed_variant: synonym,
                                miss_count: missCount,
                                synonym_found: synonymFoundCount
                            });
                        }
                    }
                    break;
                }
            }
        }

        // Sort by miss count descending and limit to 20
        const result = synonymMisses
            .sort((a, b) => b.miss_count - a.miss_count)
            .slice(0, 20);

        response.status(200).json(result);
    } catch (error) {
        console.error('Failed to fetch synonym misses:', error);
        response.status(500).json({ error: 'Failed to fetch synonym miss data' });
    }
};

module.exports = { synonymMissesService };
