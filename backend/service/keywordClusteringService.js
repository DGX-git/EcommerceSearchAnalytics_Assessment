// // var express = require('express');
// // var router = express.Router();
// // var userservice = require('../service/userservice');

// // /* GET users listing. */
// // const keywordClusteringService = (req, res) => {
// //     userservice.getUsers();
// // }

// // module.exports = {keywordClusteringService};



// var express = require('express');
// var router = express.Router();
// var sequelize = require('../config/sequelize.config');

// const keywordClusteringService = async(request, response) => {
//     try {
//         await sequelize.sync();
        
//         // Query to get keywords and create clusters based on keyword patterns
//         const keywords = await sequelize.query(`
//             SELECT DISTINCT
//                 search_keyword as keyword,
//                 COUNT(DISTINCT search_id) as search_count
//             FROM searches
//             WHERE search_keyword IS NOT NULL
//             AND search_keyword != ''
//             GROUP BY search_keyword
//             ORDER BY search_count DESC
//             LIMIT 100
//         `, {
//             type: sequelize.QueryTypes.SELECT
//         });
        
//         // Define keyword clusters based on common beauty/skincare terms
//         const clusterDefinitions = {
//             'Face Moisturizers': ['moisturizer', 'cream', 'face cream', 'hydrating', 'hydration', 'lotion', 'face lotion'],
//             'Sunscreen & SPF': ['sunscreen', 'spf', 'sun protection', 'sunblock', 'uv', 'uv protection'],
//             'Face Cleansers': ['cleanser', 'face wash', 'facial cleanser', 'cleanser', 'soap', 'face soap'],
//             'Serums & Treatments': ['serum', 'treatment', 'essence', 'toner', 'facial serum', 'skin serum'],
//             'Lip Care': ['lip balm', 'lip gloss', 'lip care', 'lip stick', 'lipstick', 'lip tint'],
//             'Eye Care': ['eye cream', 'eye serum', 'eye treatment', 'under eye', 'eye care', 'eye patch'],
//             'Masks & Exfoliants': ['mask', 'exfoliating', 'exfoliant', 'face mask', 'clay mask', 'sheet mask'],
//             'Acne & Spot Treatment': ['acne', 'acne-safe', 'spot treatment', 'blemish', 'pimple', 'anti-acne'],
//             'Natural & Organic': ['vegan', 'cruelty-free', 'organic', 'natural', 'plant-based', 'eco-friendly'],
//             'Anti-Aging': ['anti-aging', 'anti aging', 'wrinkle', 'age', 'retinol', 'collagen', 'firming']
//         };
        
//         // Assign keywords to clusters
//         const clusteredKeywords: Record<string, any> = {};
        
//         keywords.forEach((item: any) => {
//             const keyword = item.keyword.toLowerCase();
//             let assigned = false;
            
//             for (const [cluster, keywords] of Object.entries(clusterDefinitions)) {
//                 const keywordsList = keywords as string[];
//                 if (keywordsList.some(kw => keyword.includes(kw) || kw.includes(keyword))) {
//                     if (!clusteredKeywords[cluster]) {
//                         clusteredKeywords[cluster] = {
//                             cluster_name: cluster,
//                             keywords: [],
//                             total_searches: 0
//                         };
//                     }
//                     clusteredKeywords[cluster].keywords.push({
//                         keyword: item.keyword,
//                         search_count: item.search_count
//                     });
//                     clusteredKeywords[cluster].total_searches += item.search_count;
//                     assigned = true;
//                     break;
//                 }
//             }
            
//             // If not assigned to any cluster, put in "Other"
//             if (!assigned) {
//                 if (!clusteredKeywords['Other']) {
//                     clusteredKeywords['Other'] = {
//                         cluster_name: 'Other',
//                         keywords: [],
//                         total_searches: 0
//                     };
//                 }
//                 clusteredKeywords['Other'].keywords.push({
//                     keyword: item.keyword,
//                     search_count: item.search_count
//                 });
//                 clusteredKeywords['Other'].total_searches += item.search_count;
//             }
//         });
        
//         // Convert to array and sort by total searches
//         const clusterArray = Object.values(clusteredKeywords)
//             .filter((c: any) => c.keywords.length > 0)
//             .sort((a: any, b: any) => b.total_searches - a.total_searches);
        
//         response.status(200).json(clusterArray);
//     } catch (error) {
//         console.log('Failed to fetch keyword clustering', error);
//         response.status(500).json({ error: 'Failed to fetch data' });
//     }
// }

// module.exports = { keywordClusteringService };



var express = require('express');
var router = express.Router();
var sequelize = require('../config/sequelize.config');

const keywordClusteringService = async(request, response) => {
    try {
        await sequelize.sync();
        
        // Query to get keywords and create clusters based on keyword patterns
        const keywords = await sequelize.query(`
            SELECT DISTINCT
                search_keyword as keyword,
                COUNT(DISTINCT search_id) as search_count
            FROM searches
            WHERE search_keyword IS NOT NULL
            AND search_keyword != ''
            GROUP BY search_keyword
            ORDER BY search_count DESC
            LIMIT 100
        `, {
            type: sequelize.QueryTypes.SELECT
        });
        
        // Define keyword clusters based on common beauty/skincare terms
        const clusterDefinitions = {
            'Face Moisturizers': ['moisturizer', 'cream', 'face cream', 'hydrating', 'hydration', 'lotion', 'face lotion'],
            'Sunscreen & SPF': ['sunscreen', 'spf', 'sun protection', 'sunblock', 'uv', 'uv protection'],
            'Face Cleansers': ['cleanser', 'face wash', 'facial cleanser', 'cleanser', 'soap', 'face soap'],
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
        
        keywords.forEach((item) => {
            const keyword = item.keyword.toLowerCase();
            let assigned = false;
            
            for (const [cluster, keywordsList] of Object.entries(clusterDefinitions)) {
                if (keywordsList.some(kw => keyword.includes(kw) || kw.includes(keyword))) {
                    if (!clusteredKeywords[cluster]) {
                        clusteredKeywords[cluster] = {
                            cluster_name: cluster,
                            keywords: [],
                            total_searches: 0
                        };
                    }
                    clusteredKeywords[cluster].keywords.push({
                        keyword: item.keyword,
                        search_count: item.search_count
                    });
                    clusteredKeywords[cluster].total_searches += item.search_count;
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
                    keyword: item.keyword,
                    search_count: item.search_count
                });
                clusteredKeywords['Other'].total_searches += item.search_count;
            }
        });
        
        // Convert to array and sort by total searches
        const clusterArray = Object.values(clusteredKeywords)
            .filter((c) => c.keywords.length > 0)
            .sort((a, b) => b.total_searches - a.total_searches);
        
        response.status(200).json(clusterArray);
    } catch (error) {
        console.log('Failed to fetch keyword clustering', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { keywordClusteringService };