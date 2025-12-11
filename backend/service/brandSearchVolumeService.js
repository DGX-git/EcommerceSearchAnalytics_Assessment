const { Op, fn, col } = require('sequelize');
const models = require('../models');

const brandSearchVolumeService = async(request, response) => {
    try {
        // Fetch brand search volume using Sequelize ORM
        const brandSearchVolume = await models.Brand.findAll({
            attributes: [
                ['brand_name', 'brands'],
                [fn('COUNT', fn('DISTINCT', col('searches.search_id'))), 'search_volume']
            ],
            include: [
                {
                    model: models.Search,
                    as: 'searches',
                    attributes: [],
                    through: { attributes: [] }
                }
            ],
            group: ['Brand.brand_id', 'Brand.brand_name'],
            order: [[fn('COUNT', fn('DISTINCT', col('searches.search_id'))), 'DESC']],
            limit: 20,
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
