// const { fn, col } = require('sequelize');
// const models = require('../models');

// const categoryDemandService = async(request, response) => {
//     try {
//         // Fetch category demand (search volume grouped by category) using Sequelize ORM
//         const categoryDemand = await models.Category.findAll({
//             attributes: [
//                 ['category_name', 'category'],
//                 [fn('COUNT', fn('DISTINCT', col('searches.search_id'))), 'demand']
//             ],
//             include: [
//                 {
//                     model: models.Search,
//                     as: 'searches',
//                     attributes: [],
//                     through: { attributes: [] }
//                 }
//             ],
//             group: ['Category.category_id', 'Category.category_name'],
//             order: [[fn('COUNT', fn('DISTINCT', col('searches.search_id'))), 'DESC']],
//             limit: 20,
//             subQuery: false,
//             raw: true
//         });
        
//         response.status(200).json(categoryDemand);
//     } catch (error) {
//         console.error('Failed to fetch category demand', error);
//         response.status(500).json({ error: 'Failed to fetch data' });
//     }
// }

// module.exports = { categoryDemandService };



// backend/service/categoryDemandService.js
const { fn, col, Op } = require('sequelize');
const models = require('../models');

const categoryDemandService = async (request, response) => {
  try {
    const { startDate, endDate } = request.query || {};

    // Build where clause for included Search model if date filters provided
    const searchWhere = {};
    if (startDate) {
      searchWhere.search_date = { ...(searchWhere.search_date || {}), [Op.gte]: startDate };
    }
    if (endDate) {
      // make endDate inclusive by using <= endDate
      searchWhere.search_date = { ...(searchWhere.search_date || {}), [Op.lte]: endDate };
    }

    const includeObj = {
      model: models.Search,
      as: 'searches',
      attributes: [],
      through: { attributes: [] },
    };

    if (Object.keys(searchWhere).length > 0) {
      includeObj.where = searchWhere;
      includeObj.required = true; // ensures only categories with searches in range are returned
    }

    const categoryDemand = await models.Category.findAll({
      attributes: [
        ['category_name', 'category'],
        [fn('COUNT', fn('DISTINCT', col('searches.search_id'))), 'demand'],
      ],
      include: [includeObj],
      group: ['Category.category_id', 'Category.category_name'],
      order: [[fn('COUNT', fn('DISTINCT', col('searches.search_id'))), 'DESC']],
      limit: 20,
      subQuery: false,
      raw: true,
    });

    // Return the same shape expected by frontend; frontend will map 'demand' => 'search_volume'
    response.status(200).json(categoryDemand);
  } catch (error) {
    console.error('Failed to fetch category demand', error);
    response.status(500).json({ error: 'Failed to fetch data' });
  }
};

module.exports = { categoryDemandService };