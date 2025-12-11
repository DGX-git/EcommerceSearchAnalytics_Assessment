// const models = require('../models');
// const { Op, sequelize } = require('sequelize');

// /**
//  * Service to validate keyword-to-category/collection mapping accuracy
//  * Compares actual mappings against expected semantic mappings
//  * Uses Sequelize ORM with include joins for category associations
//  */
// const categoryOrCollectionMappingAccuracyService = async(request, response) => {
//     try {
//         // Define correct semantic keyword-to-category mappings
//         const correctMappings = {
//             'skincare': ['moisturizer', 'serum', 'cleanser', 'toner', 'face cream', 'face wash'],
//             'haircare': ['shampoo', 'conditioner', 'hair mask', 'hair serum', 'hairspray'],
//             'makeup': ['foundation', 'concealer', 'lipstick', 'eyeshadow', 'mascara', 'blush'],
//             'sun protection': ['sunscreen', 'spf', 'sunblock', 'uv protection'],
//             'anti-aging': ['retinol', 'collagen', 'anti-aging', 'wrinkle', 'firming'],
//             'acne treatment': ['acne', 'pimple', 'spot treatment', 'blemish', 'acne-safe'],
//             'bath & body': ['body lotion', 'body cream', 'shower gel', 'body wash'],
//             'fragrance': ['perfume', 'cologne', 'scent', 'fragrance', 'body spray']
//         };

//         // Fetch searches with their category mappings
//         const searchCategoryMappings = await models.Search.findAll({
//             attributes: ['search_id', 'search_keyword'],
//             include: [
//                 {
//                     model: models.Category,
//                     as: 'categories',
//                     attributes: ['category_id', 'category_name'],
//                     through: { attributes: [] },
//                     required: false
//                 }
//             ],
//             limit: 100,
//             raw: false
//         });

//         // Analyze mapping accuracy
//         const mappingAccuracy = {};

//         searchCategoryMappings.forEach(search => {
//             const keyword = (search.search_keyword || '').toLowerCase();
            
//             // Get mapped categories
//             const mappedCategories = search.categories && search.categories.length > 0
//                 ? search.categories.map(c => c.category_name)
//                 : ['Unmapped'];

//             mappedCategories.forEach(mappedCategory => {
//                 let expectedCategory = 'Unknown';
//                 let isCorrect = false;

//                 // Check if keyword correctly maps to expected category
//                 for (const [category, keywords] of Object.entries(correctMappings)) {
//                     const matches = keywords.some(kw => 
//                         keyword.includes(kw.toLowerCase()) || kw.toLowerCase().includes(keyword)
//                     );
                    
//                     if (matches) {
//                         expectedCategory = category;
//                         isCorrect = mappedCategory.toLowerCase().includes(category.toLowerCase());
//                         break;
//                     }
//                 }

//                 const categoryKey = `${mappedCategory}`;

//                 if (!mappingAccuracy[categoryKey]) {
//                     mappingAccuracy[categoryKey] = {
//                         category: mappedCategory,
//                         total_mappings: 0,
//                         correct_mappings: 0,
//                         total_searches: 0,
//                         correct_searches: 0,
//                         expected_category: expectedCategory,
//                         sample_keywords: []
//                     };
//                 }

//                 mappingAccuracy[categoryKey].total_mappings++;
//                 mappingAccuracy[categoryKey].total_searches++;

//                 if (isCorrect) {
//                     mappingAccuracy[categoryKey].correct_mappings++;
//                     mappingAccuracy[categoryKey].correct_searches++;
//                 }

//                 if (mappingAccuracy[categoryKey].sample_keywords.length < 3) {
//                     mappingAccuracy[categoryKey].sample_keywords.push({
//                         keyword: search.search_keyword,
//                         mapped_to: mappedCategory,
//                         expected: expectedCategory,
//                         correct: isCorrect,
//                         count: 1
//                     });
//                 }
//             });
//         });

//         // Calculate accuracy percentages and prepare results
//         const result = Object.values(mappingAccuracy)
//             .map(item => ({
//                 category: item.category,
//                 mapping_accuracy: item.total_mappings > 0 
//                     ? Math.round((item.correct_mappings / item.total_mappings) * 100)
//                     : 0,
//                 search_accuracy: item.total_searches > 0
//                     ? Math.round((item.correct_searches / item.total_searches) * 100)
//                     : 0,
//                 total_mappings: item.total_mappings,
//                 correct_mappings: item.correct_mappings,
//                 total_searches: item.total_searches,
//                 expected_category: item.expected_category,
//                 sample_keywords: item.sample_keywords
//             }))
//             .sort((a, b) => b.search_accuracy - a.search_accuracy);

//         response.status(200).json(result);
//     } catch (error) {
//         console.error('Failed to fetch category/collection mapping accuracy:', error);
//         response.status(500).json({ error: 'Failed to fetch mapping accuracy data' });
//     }
// };

// module.exports = { categoryOrCollectionMappingAccuracyService };






// backend/service/catergoryOrCollectionMappingAccuracyService.js
const models = require('../models');
const { Op } = require('sequelize');

/**
 * Service to validate keyword-to-category/collection mapping accuracy
 * Compares actual mappings against expected semantic mappings
 * Uses Sequelize ORM with include joins for category associations
 */
const categoryOrCollectionMappingAccuracyService = async (request, response) => {
  try {
    const { startDate, endDate } = request.query || {};

    // Define correct semantic keyword-to-category mappings
    const correctMappings = {
      skincare: ['moisturizer', 'serum', 'cleanser', 'toner', 'face cream', 'face wash'],
      haircare: ['shampoo', 'conditioner', 'hair mask', 'hair serum', 'hairspray'],
      makeup: ['foundation', 'concealer', 'lipstick', 'eyeshadow', 'mascara', 'blush'],
      'sun protection': ['sunscreen', 'spf', 'sunblock', 'uv protection'],
      'anti-aging': ['retinol', 'collagen', 'anti-aging', 'wrinkle', 'firming'],
      'acne treatment': ['acne', 'pimple', 'spot treatment', 'blemish', 'acne-safe'],
      'bath & body': ['body lotion', 'body cream', 'shower gel', 'body wash'],
      fragrance: ['perfume', 'cologne', 'scent', 'fragrance', 'body spray'],
    };

    // Build search date filter if provided
    const searchWhere = {};
    if (startDate) searchWhere.search_date = { ...(searchWhere.search_date || {}), [Op.gte]: startDate };
    if (endDate) searchWhere.search_date = { ...(searchWhere.search_date || {}), [Op.lte]: endDate };

    // Fetch searches with their category mappings
    const searchCategoryMappings = await models.Search.findAll({
      attributes: ['search_id', 'search_keyword', 'search_date'],
      where: Object.keys(searchWhere).length ? searchWhere : undefined,
      include: [
        {
          model: models.Category,
          as: 'categories',
          attributes: ['category_id', 'category_name'],
          through: { attributes: [] },
          required: false,
        },
      ],
      limit: 100,
      raw: false,
    });

    // Analyze mapping accuracy
    const mappingAccuracy = {};

    searchCategoryMappings.forEach((search) => {
      const keyword = (search.search_keyword || '').toLowerCase();

      // Get mapped categories
      const mappedCategories =
        search.categories && search.categories.length > 0 ? search.categories.map((c) => c.category_name) : ['Unmapped'];

      mappedCategories.forEach((mappedCategory) => {
        let expectedCategory = 'Unknown';
        let isCorrect = false;

        // Check if keyword correctly maps to expected category
        for (const [category, keywords] of Object.entries(correctMappings)) {
          const matches = keywords.some((kw) => keyword.includes(kw.toLowerCase()) || kw.toLowerCase().includes(keyword));

          if (matches) {
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
            sample_keywords: [],
          };
        }

        mappingAccuracy[categoryKey].total_mappings++;
        mappingAccuracy[categoryKey].total_searches++;

        if (isCorrect) {
          mappingAccuracy[categoryKey].correct_mappings++;
          mappingAccuracy[categoryKey].correct_searches++;
        }

        if (mappingAccuracy[categoryKey].sample_keywords.length < 50) {
          // Track more sample keywords so frontend has enough rows
          mappingAccuracy[categoryKey].sample_keywords.push({
            keyword: search.search_keyword,
            mapped_to: mappedCategory,
            expected: expectedCategory,
            correct: isCorrect,
            count: 1,
          });
        }
      });
    });

    // Calculate accuracy percentages and prepare results
    const result = Object.values(mappingAccuracy)
      .map((item) => ({
        category: item.category,
        mapping_accuracy: item.total_mappings > 0 ? Math.round((item.correct_mappings / item.total_mappings) * 100) : 0,
        search_accuracy: item.total_searches > 0 ? Math.round((item.correct_searches / item.total_searches) * 100) : 0,
        total_mappings: item.total_mappings,
        correct_mappings: item.correct_mappings,
        total_searches: item.total_searches,
        expected_category: item.expected_category,
        sample_keywords: item.sample_keywords,
      }))
      .sort((a, b) => b.search_accuracy - a.search_accuracy);

    response.status(200).json(result);
  } catch (error) {
    console.error('Failed to fetch category/collection mapping accuracy:', error);
    response.status(500).json({ error: 'Failed to fetch mapping accuracy data' });
  }
};

module.exports = { categoryOrCollectionMappingAccuracyService };