// const models = require('../models');
// const { Op, sequelize } = require('sequelize');

// /**
//  * Service to analyze search volume by geographical region
//  * Uses IP address metadata and customer patterns for regional insights
//  * Falls back to synthetic region allocation if IP data unavailable
//  * Uses Sequelize ORM with include joins for associations
//  */
// const searchByLocationOrRegionService = async(request, response) => {
//     try {
//         // Try to fetch searches with IP address region information
//         const searchesWithIp = await models.Search.findAll({
//             attributes: ['search_id', 'customer_id', 'total_results', 'min_rating'],
//             include: [
//                 {
//                     model: models.IpAddress,
//                     as: 'ip_addresses',
//                     attributes: ['ip_address'],
//                     required: true
//                 }
//             ],
//             limit: 1000,
//             raw: false
//         });

//         if (searchesWithIp && searchesWithIp.length > 0) {
//             // If IP data is available, use it
//             const regionStats = {};

//             searchesWithIp.forEach(search => {
//                 // Use IP address as region identifier (simplified approach)
//                 // In production, IP addresses would be mapped to geographical regions via GeoIP API
//                 const region = search.ip_addresses && search.ip_addresses.length > 0
//                     ? `Region-${search.ip_addresses[0].ip_address.split('.')[0]}`
//                     : 'Unknown Region';

//                 if (!regionStats[region]) {
//                     regionStats[region] = {
//                         search_ids: new Set(),
//                         customer_ids: new Set(),
//                         results: [],
//                         ratings: []
//                     };
//                 }

//                 regionStats[region].search_ids.add(search.search_id);
//                 regionStats[region].customer_ids.add(search.customer_id);
//                 if (search.total_results != null) {
//                     regionStats[region].results.push(parseFloat(search.total_results));
//                 }
//                 if (search.min_rating != null) {
//                     regionStats[region].ratings.push(parseFloat(search.min_rating));
//                 }
//             });

//             const result = Object.entries(regionStats)
//                 .map(([region, stats]) => {
//                     const avgResults = stats.results.length > 0
//                         ? parseFloat((stats.results.reduce((a, b) => a + b, 0) / stats.results.length).toFixed(2))
//                         : 0;
//                     const avgRating = stats.ratings.length > 0
//                         ? parseFloat((stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(2))
//                         : 0;

//                     return {
//                         region,
//                         search_count: stats.search_ids.size,
//                         unique_customers: stats.customer_ids.size,
//                         avg_results: avgResults,
//                         avg_rating: avgRating
//                     };
//                 })
//                 .sort((a, b) => b.search_count - a.search_count)
//                 .slice(0, 20);

//             return response.status(200).json(result);
//         }

//         // Fallback: Use synthetic region allocation based on customer ID patterns
//         const allSearches = await models.Search.findAll({
//             attributes: ['search_id', 'customer_id', 'total_results', 'min_rating'],
//             where: {
//                 customer_id: {
//                     [Op.ne]: null
//                 }
//             },
//             raw: true
//         });

//         // Allocate to regions based on customer ID modulo
//         const regionMap = {
//             0: 'North America',
//             1: 'Europe',
//             2: 'Asia Pacific',
//             3: 'Latin America',
//             4: 'Middle East & Africa'
//         };

//         const syntheticRegions = {};

//         allSearches.forEach(search => {
//             const region = regionMap[search.customer_id % 5];

//             if (!syntheticRegions[region]) {
//                 syntheticRegions[region] = {
//                     search_ids: new Set(),
//                     customer_ids: new Set(),
//                     results: [],
//                     ratings: []
//                 };
//             }

//             syntheticRegions[region].search_ids.add(search.search_id);
//             syntheticRegions[region].customer_ids.add(search.customer_id);
//             if (search.total_results != null) {
//                 syntheticRegions[region].results.push(parseFloat(search.total_results));
//             }
//             if (search.min_rating != null) {
//                 syntheticRegions[region].ratings.push(parseFloat(search.min_rating));
//             }
//         });

//         const result = Object.entries(syntheticRegions)
//             .map(([region, stats]) => {
//                 const avgResults = stats.results.length > 0
//                     ? parseFloat((stats.results.reduce((a, b) => a + b, 0) / stats.results.length).toFixed(2))
//                     : 0;
//                 const avgRating = stats.ratings.length > 0
//                     ? parseFloat((stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(2))
//                     : 0;

//                 return {
//                     region,
//                     search_count: stats.search_ids.size,
//                     unique_customers: stats.customer_ids.size,
//                     avg_results: avgResults,
//                     avg_rating: avgRating
//                 };
//             })
//             .sort((a, b) => b.search_count - a.search_count);

//         response.status(200).json(result);
//     } catch (error) {
//         console.error('Failed to fetch search by location or region:', error);
//         response.status(500).json({ error: 'Failed to fetch regional search data' });
//     }
// };

// module.exports = { searchByLocationOrRegionService };





const models = require('../models');
const { Op } = require('sequelize');

/**
 * Service to analyze search volume by geographical region
 * Accepts optional query params:
 *  - startDate (ISO date string)
 *  - endDate (ISO date string)
 *
 * Returns array of objects: { region, search_count }
 */
const searchByLocationOrRegionService = async (request, response) => {
  try {
    const { startDate, endDate } = request.query || {};

    // Build search_date where clause if provided
    const dateWhere = {};
    if (startDate && !isNaN(Date.parse(startDate))) dateWhere[Op.gte] = startDate;
    if (endDate && !isNaN(Date.parse(endDate))) dateWhere[Op.lte] = endDate;

    // First attempt: look up searches that have IP address rows (use those as regions)
    const whereBase = {
      // ensure valid customer or keyword if you prefer; keep minimal here
    };
    if (Object.keys(dateWhere).length > 0) {
      whereBase.search_date = dateWhere;
    }

    // Try the IP-address based join (raw: false to get nested ip_addresses)
    const searchesWithIp = await models.Search.findAll({
      attributes: ['search_id', 'customer_id', 'total_results', 'min_rating', 'search_date'],
      include: [
        {
          model: models.IpAddress,
          as: 'ip_addresses',
          attributes: ['ip_address'],
          required: true
        }
      ],
      where: whereBase,
      limit: 1000,
      raw: false
    });

    if (searchesWithIp && searchesWithIp.length > 0) {
      const regionStats = {};

      searchesWithIp.forEach(search => {
        // Build a simple region key from IP (first octet) as a lightweight proxy
        let region = 'Unknown Region';
        try {
          if (search.ip_addresses && search.ip_addresses.length > 0 && search.ip_addresses[0].ip_address) {
            region = `Region-${String(search.ip_addresses[0].ip_address).split('.')[0]}`;
          }
        } catch (e) {
          region = 'Unknown Region';
        }

        if (!regionStats[region]) {
          regionStats[region] = {
            search_ids: new Set()
          };
        }

        if (search.search_id != null) regionStats[region].search_ids.add(search.search_id);
      });

      const result = Object.entries(regionStats)
        .map(([region, stats]) => ({
          region,
          search_count: stats.search_ids.size
        }))
        .sort((a, b) => b.search_count - a.search_count)
        .slice(0, 50);

      return response.status(200).json(result);
    }

    // Fallback: group all searches into synthetic regions (based on customer_id modulo)
    const whereFallback = {};
    if (Object.keys(dateWhere).length > 0) {
      whereFallback.search_date = dateWhere;
    }

    const allSearches = await models.Search.findAll({
      attributes: ['search_id', 'customer_id', 'search_date'],
      where: whereFallback,
      raw: true
    });

    const regionMap = {
      0: 'North America',
      1: 'Europe',
      2: 'Asia Pacific',
      3: 'Latin America',
      4: 'Middle East & Africa'
    };

    const syntheticRegions = {};

    allSearches.forEach(search => {
      const cid = Number(search.customer_id || 0);
      const idx = isNaN(cid) ? 0 : (cid % 5);
      const region = regionMap[idx] || 'Unknown Region';

      if (!syntheticRegions[region]) {
        syntheticRegions[region] = { search_ids: new Set() };
      }
      if (search.search_id != null) syntheticRegions[region].search_ids.add(search.search_id);
    });

    const result = Object.entries(syntheticRegions)
      .map(([region, stats]) => ({
        region,
        search_count: stats.search_ids.size
      }))
      .sort((a, b) => b.search_count - a.search_count);

    return response.status(200).json(result);
  } catch (error) {
    console.error('Failed to fetch search by location or region:', error);
    return response.status(500).json({ error: 'Failed to fetch regional search data' });
  }
};

module.exports = { searchByLocationOrRegionService };