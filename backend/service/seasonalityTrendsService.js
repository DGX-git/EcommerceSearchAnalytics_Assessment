const models = require('../models');
const { Op, fn, col, sequelize } = require('sequelize');

/**
 * Service to analyze seasonality trends in search volume
 * Groups search data by month and season (Winter, Spring, Summer, Fall)
 * Uses Sequelize ORM with application-layer date grouping
 */
const seasonalityTrendsService = async(request, response) => {
    try {
        // Fetch all searches with dates
        const searches = await models.Search.findAll({
            attributes: ['search_id', 'search_date', 'customer_id', 'total_results', 'min_rating'],
            where: {
                search_date: {
                    [Op.ne]: null
                }
            },
            raw: true
        });

        // Helper function to get season from month
        const getSeason = (month) => {
            if ([12, 1, 2].includes(month)) return 'Winter';
            if ([3, 4, 5].includes(month)) return 'Spring';
            if ([6, 7, 8].includes(month)) return 'Summer';
            if ([9, 10, 11].includes(month)) return 'Fall';
            return 'Unknown';
        };

        // Helper function to get year-month string
        const getYearMonth = (date) => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            return `${year}-${month}`;
        };

        // Group searches by month and season
        const trendData = {};

        searches.forEach(search => {
            const date = new Date(search.search_date);
            const month = date.getMonth() + 1;
            const yearMonth = getYearMonth(search.search_date);
            const season = getSeason(month);

            const key = `${season}|${yearMonth}`;

            if (!trendData[key]) {
                trendData[key] = {
                    season,
                    month: yearMonth,
                    search_ids: new Set(),
                    customer_ids: new Set(),
                    results: [],
                    ratings: []
                };
            }

            trendData[key].search_ids.add(search.search_id);
            trendData[key].customer_ids.add(search.customer_id);
            if (search.total_results != null) {
                trendData[key].results.push(parseFloat(search.total_results));
            }
            if (search.min_rating != null) {
                trendData[key].ratings.push(parseFloat(search.min_rating));
            }
        });

        // Calculate metrics and prepare result
        const result = Object.values(trendData)
            .map(data => {
                const avgResults = data.results.length > 0
                    ? parseFloat((data.results.reduce((a, b) => a + b, 0) / data.results.length).toFixed(2))
                    : 0;
                const avgRating = data.ratings.length > 0
                    ? parseFloat((data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(2))
                    : 0;

                return {
                    season: data.season,
                    month: data.month,
                    search_volume: data.search_ids.size,
                    unique_customers: data.customer_ids.size,
                    avg_results: avgResults,
                    avg_rating: avgRating
                };
            })
            .sort((a, b) => b.month.localeCompare(a.month))
            .slice(0, 24);

        response.status(200).json(result);
    } catch (error) {
        console.error('Failed to fetch seasonality trends:', error);
        response.status(500).json({ error: 'Failed to fetch seasonality trend data' });
    }
};

module.exports = { seasonalityTrendsService };
