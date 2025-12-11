const { Op, fn, col } = require('sequelize');
const models = require('../models');

const zeroResultsSearchesService = async(request, response) => {
    try {
        // Fetch keywords that returned zero results using Sequelize ORM
        const zeroResultsSearches = await models.Search.findAll({
            attributes: [
                ['search_keyword', 'keyword'],
                [fn('COUNT', col('search_id')), 'count']
            ],
            where: {
                total_results: 0,
                search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
            },
            group: ['search_keyword'],
            order: [[fn('COUNT', col('search_id')), 'DESC']],
            limit: 20,
            subQuery: false,
            raw: true
        });
        
        response.status(200).json(zeroResultsSearches);
    } catch (error) {
        console.error('Failed to fetch zero results searches', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { zeroResultsSearchesService };
