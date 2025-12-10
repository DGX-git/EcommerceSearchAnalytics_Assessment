// var express = require('express');
// var router = express.Router();
// var userservice = require('../service/userservice');

// /* GET users listing. */
// const categoryOrCollectionMappingAccuracyService = (req, res) => {
//     userservice.getUsers();
// }

// module.exports = {categoryOrCollectionMappingAccuracyService};


var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const categoryOrCollectionMappingAccuracyService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Define keyword-to-category semantic mappings (correct mappings)
        const correctMappings = {
            'skincare': ['moisturizer', 'serum', 'cleanser', 'toner', 'face cream', 'face wash'],
            'haircare': ['shampoo', 'conditioner', 'hair mask', 'hair serum', 'hairspray'],
            'makeup': ['foundation', 'concealer', 'lipstick', 'eyeshadow', 'mascara', 'blush'],
            'sun protection': ['sunscreen', 'spf', 'sunblock', 'uv protection'],
            'anti-aging': ['retinol', 'collagen', 'anti-aging', 'wrinkle', 'firming'],
            'acne treatment': ['acne', 'pimple', 'spot treatment', 'blemish', 'acne-safe'],
            'bath & body': ['body lotion', 'body cream', 'shower gel', 'body wash'],
            'fragrance': ['perfume', 'cologne', 'scent', 'fragrance', 'body spray']
        };
        
        // Query all searches with their mapped categories
        const searchCategoryMappings = await sequelize.query(`
            SELECT 
                s.search_keyword,
                c.category_name,
                COUNT(DISTINCT s.search_id) as search_count
            FROM searches s
            LEFT JOIN search_categories sc ON s.search_id = sc.search_id
            LEFT JOIN categories c ON sc.category_id = c.category_id
            WHERE s.search_keyword IS NOT NULL
            AND s.search_keyword != ''
            GROUP BY s.search_keyword, c.category_name
            ORDER BY search_count DESC
            LIMIT 100
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        // Analyze mapping accuracy
        const mappingAccuracy = {};
        
        for (const mapping of searchCategoryMappings) {
            const keyword = mapping.search_keyword.toLowerCase();
            const mappedCategory = mapping.category_name || 'Unmapped';
            const searchCount = mapping.search_count;
            
            let isCorrect = false;
            let expectedCategory = 'Unknown';
            
            // Check if keyword correctly maps to its category
            for (const [category, keywords] of Object.entries(correctMappings)) {
                const keywordsList = keywords;
                if (keywordsList.some(kw => keyword.includes(kw) || kw.includes(keyword))) {
                    expectedCategory = category;
                    isCorrect = mappedCategory.toLowerCase().includes(category.toLowerCase());
                    break;
                }
            }
            
            const categoryKey = `${mappedCategory}`;
            
            if (!mappingAccuracy[categoryKey]) {
                mappingAccuracy[categoryKey] = {
                    category: mappedCategory,
                    total_mappings: 0,
                    correct_mappings: 0,
                    total_searches: 0,
                    correct_searches: 0,
                    expected_category: expectedCategory,
                    sample_keywords: []
                };
            }
            
            mappingAccuracy[categoryKey].total_mappings++;
            mappingAccuracy[categoryKey].total_searches += searchCount;
            
            if (isCorrect) {
                mappingAccuracy[categoryKey].correct_mappings++;
                mappingAccuracy[categoryKey].correct_searches += searchCount;
            }
            
            if (mappingAccuracy[categoryKey].sample_keywords.length < 3) {
                mappingAccuracy[categoryKey].sample_keywords.push({
                    keyword: mapping.search_keyword,
                    mapped_to: mappedCategory,
                    expected: expectedCategory,
                    correct: isCorrect,
                    count: searchCount
                });
            }
        }
        
        // Calculate accuracy percentages
        const accuracyResults = Object.values(mappingAccuracy)
            .map((item) => ({
                category: item.category,
                mapping_accuracy: item.total_mappings > 0 ? Math.round((item.correct_mappings / item.total_mappings) * 100) : 0,
                search_accuracy: item.total_searches > 0 ? Math.round((item.correct_searches / item.total_searches) * 100) : 0,
                total_mappings: item.total_mappings,
                correct_mappings: item.correct_mappings,
                total_searches: item.total_searches,
                expected_category: item.expected_category,
                sample_keywords: item.sample_keywords
            }))
            .sort((a, b) => b.search_accuracy - a.search_accuracy);
        
        response.status(200).json(accuracyResults);
    } catch (error) {
        console.log('Failed to fetch category/collection mapping accuracy', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { categoryOrCollectionMappingAccuracyService };