const { fn, col } = require('sequelize');
const models = require('../models');

const categoryDemandService = async(request, response) => {
    try {
        // Fetch category demand (search volume grouped by category) using Sequelize ORM
        const categoryDemand = await models.Category.findAll({
            attributes: [
                ['category_name', 'category'],
                [fn('COUNT', fn('DISTINCT', col('searches.search_id'))), 'demand']
            ],
            include: [
                {
                    model: models.Search,
                    as: 'searches',
                    attributes: [],
                    through: { attributes: [] }
                }
            ],
            group: ['Category.category_id', 'Category.category_name'],
            order: [[fn('COUNT', fn('DISTINCT', col('searches.search_id'))), 'DESC']],
            limit: 20,
            subQuery: false,
            raw: true
        });
        
        response.status(200).json(categoryDemand);
    } catch (error) {
        console.error('Failed to fetch category demand', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { categoryDemandService };
