// const { Op } = require('sequelize');
// const models = require('../models');

// const sequelize = models.sequelize;

// const attributeTrendsService = async(request, response) => {
//     try {
//         // Define the special attributes we want to track and their search patterns
//         const attributePatterns = {
//             'vegan': '%vegan%',
//             'SPF': '%spf%',
//             'acne-safe': '%acne%',
//             'cruelty-free': '%cruelty-free%',
//             'organic': '%organic%',
//             'natural': '%natural%',
//             'hypoallergenic': '%hypoallergenic%',
//             'fragrance-free': '%fragrance-free%'
//         };
        
//         const attributeCounts = [];
        
//         // Process each attribute and count searches
//         for (const [attribute, pattern] of Object.entries(attributePatterns)) {
//             const count = await models.Search.count({
//                 where: {
//                     [Op.and]: [
//                         // attributes is JSONB; cast to text so we can apply ILIKE search patterns
//                         sequelize.where(
//                             sequelize.cast(sequelize.col('attributes'), 'text'),
//                             { [Op.iLike]: pattern }
//                         ),
//                         { attributes: { [Op.ne]: null } }
//                     ]
//                 }
//             });
            
//             if (count > 0) {
//                 attributeCounts.push({
//                     attribute: attribute,
//                     trend_value: count
//                 });
//             }
//         }
        
//         // Sort by trend_value descending and limit to 20
//         const sortedResults = attributeCounts
//             .sort((a, b) => b.trend_value - a.trend_value)
//             .slice(0, 20);
        
//         response.status(200).json(sortedResults);
//     } catch (error) {
//         console.error('Failed to fetch attribute trends', error);
//         response.status(500).json({ error: 'Failed to fetch data' });
//     }
// }

// module.exports = { attributeTrendsService };



// backend/service/attributeTrendsService.js
const models = require('../models');
const sequelize = models.sequelize;

const attributeTrendsService = async (request, response) => {
  try {
    // Parse optional query params
    const startDate = request.query.startDate ? new Date(request.query.startDate) : null;
    const endDate = request.query.endDate ? new Date(request.query.endDate) : null;

    let dateFilter = '';
    const replacements = {};

    if (startDate && endDate) {
      // include entire end day by setting time to end of day, or rely on caller's day-range; here we use inclusive dates
      replacements.startDate = startDate;
      replacements.endDate = endDate;
      dateFilter = `AND s.search_date >= :startDate AND s.search_date <= :endDate`;
    }

    // Note: attributes is JSONB -> cast to text before applying LOWER() / LIKE
    const rows = await sequelize.query(
      `
      SELECT
        CASE
          WHEN LOWER(CAST(s.attributes AS text)) LIKE '%vegan%' THEN 'vegan'
          WHEN LOWER(CAST(s.attributes AS text)) LIKE '%spf%' THEN 'SPF'
          WHEN LOWER(CAST(s.attributes AS text)) LIKE '%acne%' THEN 'acne-safe'
          WHEN LOWER(CAST(s.attributes AS text)) LIKE '%cruelty-free%' THEN 'cruelty-free'
          WHEN LOWER(CAST(s.attributes AS text)) LIKE '%organic%' THEN 'organic'
          WHEN LOWER(CAST(s.attributes AS text)) LIKE '%natural%' THEN 'natural'
          WHEN LOWER(CAST(s.attributes AS text)) LIKE '%hypoallergenic%' THEN 'hypoallergenic'
          WHEN LOWER(CAST(s.attributes AS text)) LIKE '%fragrance-free%' THEN 'fragrance-free'
          ELSE NULL
        END AS attribute,
        DATE_TRUNC('week', s.search_date)::date AS week,
        COUNT(DISTINCT s.search_id) AS search_volume
      FROM searches s
      WHERE s.search_keyword IS NOT NULL
        AND s.search_keyword != ''
        ${dateFilter}
        AND s.attributes IS NOT NULL
        AND (
          LOWER(CAST(s.attributes AS text)) LIKE '%vegan%'
          OR LOWER(CAST(s.attributes AS text)) LIKE '%spf%'
          OR LOWER(CAST(s.attributes AS text)) LIKE '%acne%'
          OR LOWER(CAST(s.attributes AS text)) LIKE '%cruelty-free%'
          OR LOWER(CAST(s.attributes AS text)) LIKE '%organic%'
          OR LOWER(CAST(s.attributes AS text)) LIKE '%natural%'
          OR LOWER(CAST(s.attributes AS text)) LIKE '%hypoallergenic%'
          OR LOWER(CAST(s.attributes AS text)) LIKE '%fragrance-free%'
        )
      GROUP BY attribute, week
      ORDER BY week DESC, search_volume DESC
      `,
      {
        replacements,
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Response: array of rows { attribute, week, search_volume }
    response.status(200).json(rows);
  } catch (err) {
    console.error('Failed to fetch attribute trends', err);
    response.status(500).json({ error: 'Failed to fetch data' });
  }
};

module.exports = { attributeTrendsService };