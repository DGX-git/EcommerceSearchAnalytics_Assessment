const models = require('../models');
const { Op, sequelize } = require('sequelize');

/**
 * Service to cluster keywords into semantic categories
 * Groups related keywords by predefined cluster definitions
 * Uses Sequelize ORM with application-layer keyword matching
 */
const keywordClusteringService = async(request, response) => {
    try {
        // Fetch all unique keywords with their search counts
        const keywords = await models.Search.findAll({
            attributes: [
                'search_keyword',
                [sequelize.fn('COUNT', sequelize.col('search_id')), 'search_count']
            ],
            where: {
                search_keyword: {
                    [Op.and]: [
                        { [Op.ne]: null },
                        { [Op.ne]: '' }
                    ]
                }
            },
            group: ['search_keyword'],
            order: [[sequelize.literal('search_count'), 'DESC']],
            limit: 100,
            subQuery: false,
            raw: true
        });

        // Define keyword clusters based on beauty/skincare terms
        const clusterDefinitions = {
            'Face Moisturizers': ['moisturizer', 'cream', 'face cream', 'hydrating', 'hydration', 'lotion', 'face lotion'],
            'Sunscreen & SPF': ['sunscreen', 'spf', 'sun protection', 'sunblock', 'uv', 'uv protection'],
            'Face Cleansers': ['cleanser', 'face wash', 'facial cleanser', 'soap', 'face soap'],
            'Serums & Treatments': ['serum', 'treatment', 'essence', 'toner', 'facial serum', 'skin serum'],
            'Lip Care': ['lip balm', 'lip gloss', 'lip care', 'lip stick', 'lipstick', 'lip tint'],
            'Eye Care': ['eye cream', 'eye serum', 'eye treatment', 'under eye', 'eye care', 'eye patch'],
            'Masks & Exfoliants': ['mask', 'exfoliating', 'exfoliant', 'face mask', 'clay mask', 'sheet mask'],
            'Acne & Spot Treatment': ['acne', 'acne-safe', 'spot treatment', 'blemish', 'pimple', 'anti-acne'],
            'Natural & Organic': ['vegan', 'cruelty-free', 'organic', 'natural', 'plant-based', 'eco-friendly'],
            'Anti-Aging': ['anti-aging', 'anti aging', 'wrinkle', 'age', 'retinol', 'collagen', 'firming']
        };

        // Assign keywords to clusters
        const clusteredKeywords = {};

        keywords.forEach(item => {
            const keyword = item.search_keyword.toLowerCase();
            const searchCount = parseInt(item.search_count) || 0;
            let assigned = false;

            for (const [cluster, keywordsList] of Object.entries(clusterDefinitions)) {
                const matches = keywordsList.some(kw => 
                    keyword.includes(kw.toLowerCase()) || kw.toLowerCase().includes(keyword)
                );
                
                if (matches) {
                    if (!clusteredKeywords[cluster]) {
                        clusteredKeywords[cluster] = {
                            cluster_name: cluster,
                            keywords: [],
                            total_searches: 0
                        };
                    }
                    
                    clusteredKeywords[cluster].keywords.push({
                        keyword: item.search_keyword,
                        search_count: searchCount
                    });
                    clusteredKeywords[cluster].total_searches += searchCount;
                    assigned = true;
                    break;
                }
            }

            // If not assigned to any cluster, put in "Other"
            if (!assigned) {
                if (!clusteredKeywords['Other']) {
                    clusteredKeywords['Other'] = {
                        cluster_name: 'Other',
                        keywords: [],
                        total_searches: 0
                    };
                }
                
                clusteredKeywords['Other'].keywords.push({
                    keyword: item.search_keyword,
                    search_count: searchCount
                });
                clusteredKeywords['Other'].total_searches += searchCount;
            }
        });

        // Convert to array, filter, and sort by total searches
        const result = Object.values(clusteredKeywords)
            .filter(cluster => cluster.keywords.length > 0)
            .sort((a, b) => b.total_searches - a.total_searches);

        response.status(200).json(result);
    } catch (error) {
        console.error('Failed to fetch keyword clustering:', error);
        response.status(500).json({ error: 'Failed to fetch keyword cluster data' });
    }
};

module.exports = { keywordClusteringService };
