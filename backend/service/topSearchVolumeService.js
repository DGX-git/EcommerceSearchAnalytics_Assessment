const { Op, fn, col } = require('sequelize');
const models = require('../models');

const topSearchVolumeService = async(request, response) => {
    try {
        // Get current date and calculate the start of the week (last 7 days)
        const currentDate = new Date();
        const startOfWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Query to get top search keywords grouped by search_keyword with their count for the past week
        const result = await models.Search.findAll({
            attributes: [
                ['search_keyword', 'keyword'],
                [fn('COUNT', col('search_id')), 'search_volume']
            ],
            where: {
                search_date: { [Op.gte]: startOfWeek },
                search_keyword: { [Op.and]: [{ [Op.not]: null }, { [Op.ne]: '' }] }
            },
            group: ['search_keyword'],
            order: [[fn('COUNT', col('search_id')), 'DESC']],
            limit: 20,
            subQuery: false,
            raw: true
        });
        
        response.status(200).json(result);
    } catch (error) {
        console.error('Failed to fetch top search volume', error);
        response.status(500).json({ error: 'Failed to fetch data' });
    }
}

module.exports = { topSearchVolumeService };
