// const { Op, fn, col } = require('sequelize');
// const models = require('../models');

// const brandSearchVolumeService = async(request, response) => {
//     try {
//         // Fetch brand search volume using Sequelize ORM
//         const brandSearchVolume = await models.Brand.findAll({
//             attributes: [
//                 ['brand_name', 'brands'],
//                 [fn('COUNT', fn('DISTINCT', col('searches.search_id'))), 'search_volume']
//             ],
//             include: [
//                 {
//                     model: models.Search,
//                     as: 'searches',
//                     attributes: [],
//                     through: { attributes: [] }
//                 }
//             ],
//             group: ['Brand.brand_id', 'Brand.brand_name'],
//             order: [[fn('COUNT', fn('DISTINCT', col('searches.search_id'))), 'DESC']],
//             limit: 20,
//             subQuery: false,
//             raw: true
//         });
        
//         response.status(200).json(brandSearchVolume);
//     } catch (error) {
//         console.error('Failed to fetch brand search volume', error);
//         response.status(500).json({ error: 'Failed to fetch data' });
//     }
// }

// module.exports = { brandSearchVolumeService };


const { Op, fn, col } = require('sequelize');
const models = require('../models');

const brandSearchVolumeService = async (request, response) => {
  try {
    // parse optional date filters YYYY-MM-DD
    const { startDate, endDate } = request.query;

    // Build where clause for included searches (applies to the join)
    const searchWhere = {
      search_keyword: { [Op.ne]: null },
      // filter out empty string keywords as well
      // use Op.ne '' or Op.not
    };

    if (startDate) {
      // include start
      searchWhere.search_date = { ...(searchWhere.search_date || {}), [Op.gte]: new Date(startDate) };
    }
    if (endDate) {
      // include end (inclusive)
      // set to end of day so day is inclusive if caller passes date-only
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      searchWhere.search_date = { ...(searchWhere.search_date || {}), [Op.lte]: end };
    }

    // Fetch brand search volume using Sequelize ORM with date filtering applied to the included searches
    const brandSearchVolume = await models.Brand.findAll({
      attributes: [
        // alias brand_name -> brand to match frontend expecting `brand`
        ['brand_name', 'brand'],
        [fn('COUNT', fn('DISTINCT', col('searches.search_id'))), 'search_volume']
      ],
      include: [
        {
          model: models.Search,
          as: 'searches',
          attributes: [],
          through: { attributes: [] },
          where: searchWhere
        }
      ],
      group: ['Brand.brand_id', 'Brand.brand_name'],
      order: [[fn('COUNT', fn('DISTINCT', col('searches.search_id'))), 'DESC']],
      limit: 50,
      subQuery: false,
      raw: true
    });

    response.status(200).json(brandSearchVolume);
  } catch (error) {
    console.error('Failed to fetch brand search volume', error);
    response.status(500).json({ error: 'Failed to fetch data' });
  }
}

module.exports = { brandSearchVolumeService };