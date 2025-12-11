const models = require('../models');

/**
 * Generic data fetching service
 * Retrieves all search records with associated metrics and relationships
 * Uses Sequelize ORM with eager loading of associations
 */
const getData = async(request, response) => {
    try {
        // Fetch all searches with their associated data
        const allData = await models.Search.findAll({
            attributes: [
                'search_id',
                'customer_id',
                'search_keyword',
                'attributes',
                'min_price',
                'max_price',
                'min_rating',
                'total_results',
                'search_date'
            ],
            include: [
                {
                    model: models.Customer,
                    as: 'customer',
                    attributes: ['customer_id', 'customer_email'],
                    required: false
                },
                {
                    model: models.SearchMetric,
                    as: 'metrics',
                    attributes: ['min_price', 'max_price', 'min_rating', 'total_results'],
                    required: false
                },
                {
                    model: models.Category,
                    as: 'categories',
                    attributes: ['category_id', 'category_name'],
                    through: { attributes: [] },
                    required: false
                },
                {
                    model: models.Brand,
                    as: 'brands',
                    attributes: ['brand_id', 'brand_name'],
                    through: { attributes: [] },
                    required: false
                },
                {
                    model: models.Collection,
                    as: 'collections',
                    attributes: ['collection_id', 'collection_name'],
                    through: { attributes: [] },
                    required: false
                }
            ],
            order: [['search_date', 'DESC']],
            limit: 1000,
            raw: false
        });

        // Return the fetched data
        response.status(200).json(allData);
    } catch (error) {
        console.error('Failed to fetch data:', error);
        response.status(500).json({ error: 'Failed to fetch data from database' });
    }
};

module.exports = { getData };
