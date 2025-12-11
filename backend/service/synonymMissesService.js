// const models = require('../models');
// const { Op, sequelize } = require('sequelize');

// /**
//  * Service to find zero-result searches that have synonyms with successful results
//  * Identifies missed search opportunities due to lack of synonym handling
//  * Uses Sequelize ORM with application-layer synonym matching logic
//  */
// const synonymMissesService = async(request, response) => {
//     try {
//         // Define synonym mappings - keywords that should match but don't
//         const synonymMappings = {
//             'face lotion': ['moisturizer', 'cream', 'hydrating'],
//             'lip moisturizer': ['lip balm', 'lip care'],
//             'facial wash': ['cleanser', 'face wash', 'face soap'],
//             'eye balm': ['eye cream', 'eye serum'],
//             'pimple cream': ['acne treatment', 'blemish', 'spot treatment'],
//             'skin toner': ['toner', 'essence'],
//             'sunblock': ['sunscreen', 'spf'],
//             'anti wrinkle': ['anti-aging', 'retinol'],
//             'face exfoliator': ['exfoliant', 'mask'],
//             'hydrating serum': ['serum', 'essence', 'treatment']
//         };

//         // Fetch zero-result searches
//         const zeroResultSearches = await models.Search.findAll({
//             attributes: ['search_id', 'search_keyword'],
//             where: {
//                 total_results: 0,
//                 search_keyword: {
//                     [Op.and]: [
//                         { [Op.ne]: null },
//                         { [Op.ne]: '' }
//                     ]
//                 }
//             },
//             raw: true
//         });

//         // Group zero-result searches by keyword
//         const keywordGroups = {};
//         zeroResultSearches.forEach(search => {
//             const keyword = search.search_keyword;
//             if (!keywordGroups[keyword]) {
//                 keywordGroups[keyword] = 0;
//             }
//             keywordGroups[keyword]++;
//         });

//         // Fetch all searches with results for synonym matching
//         const successfulSearches = await models.Search.findAll({
//             attributes: ['search_keyword'],
//             where: {
//                 total_results: {
//                     [Op.gt]: 0
//                 },
//                 search_keyword: {
//                     [Op.and]: [
//                         { [Op.ne]: null },
//                         { [Op.ne]: '' }
//                     ]
//                 }
//             },
//             raw: true
//         });

//         const successfulKeywords = new Set(
//             successfulSearches.map(s => s.search_keyword.toLowerCase())
//         );

//         // Find synonym misses
//         const synonymMisses = [];

//         for (const [missedKeyword, missCount] of Object.entries(keywordGroups)) {
//             const lowerMissed = missedKeyword.toLowerCase();

//             // Check if this keyword has defined synonyms
//             for (const [searchTerm, synonyms] of Object.entries(synonymMappings)) {
//                 if (lowerMissed.includes(searchTerm) || searchTerm.includes(lowerMissed)) {
//                     // Check each synonym
//                     for (const synonym of synonyms) {
//                         const lowerSynonym = synonym.toLowerCase();
                        
//                         // Check if any successful search contains this synonym
//                         const hasSynonym = Array.from(successfulKeywords).some(
//                             keyword => keyword.includes(lowerSynonym) || lowerSynonym.includes(keyword)
//                         );

//                         if (hasSynonym) {
//                             const synonymFoundCount = Array.from(successfulKeywords).filter(
//                                 keyword => keyword.includes(lowerSynonym) || lowerSynonym.includes(keyword)
//                             ).length;

//                             synonymMisses.push({
//                                 keyword: missedKeyword,
//                                 missed_variant: synonym,
//                                 miss_count: missCount,
//                                 synonym_found: synonymFoundCount
//                             });
//                         }
//                     }
//                     break;
//                 }
//             }
//         }

//         // Sort by miss count descending and limit to 20
//         const result = synonymMisses
//             .sort((a, b) => b.miss_count - a.miss_count)
//             .slice(0, 20);

//         response.status(200).json(result);
//     } catch (error) {
//         console.error('Failed to fetch synonym misses:', error);
//         response.status(500).json({ error: 'Failed to fetch synonym miss data' });
//     }
// };

// module.exports = { synonymMissesService };




const models = require('../models');
const { Op } = require('sequelize');

/**
 * synonymMissesService
 * - Accepts optional query params: startDate, endDate (ISO)
 * - Returns rows with fields:
 *    { searched_keyword, expected_synonym, search_count, result_count }
 *
 * Logic:
 * - Use a small mapping of expected synonyms (existing mapping in file)
 * - Count zero-result searches per searched keyword within date range
 * - For each expected synonym, count successful searches that match the synonym within date range
 * - Return best matches: searched keyword + synonym + search_count + result_count
 */
const synonymMissesService = async (request, response) => {
  try {
    const { startDate, endDate } = request.query || {};

    // date filter
    const dateWhere = {};
    if (startDate && !isNaN(Date.parse(startDate))) dateWhere[Op.gte] = startDate;
    if (endDate && !isNaN(Date.parse(endDate))) dateWhere[Op.lte] = endDate;

    // synonym mappings
    const synonymMappings = {
      'face lotion': ['moisturizer', 'cream', 'hydrating'],
      'lip moisturizer': ['lip balm', 'lip care'],
      'facial wash': ['cleanser', 'face wash', 'face soap'],
      'eye balm': ['eye cream', 'eye serum'],
      'pimple cream': ['acne treatment', 'blemish', 'spot treatment'],
      'skin toner': ['toner', 'essence'],
      'sunblock': ['sunscreen', 'spf'],
      'anti wrinkle': ['anti-aging', 'retinol'],
      'face exfoliator': ['exfoliant', 'mask'],
      'hydrating serum': ['serum', 'essence', 'treatment']
    };

    // Build where for zero-result searches
    const zeroWhere = {
      total_results: 0,
      search_keyword: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] }
    };
    if (Object.keys(dateWhere).length > 0) zeroWhere.search_date = dateWhere;

    const zeroResultSearches = await models.Search.findAll({
      attributes: ['search_id', 'search_keyword'],
      where: zeroWhere,
      raw: true
    });

    // Count zero-result searches per keyword
    const zeroCounts = {};
    zeroResultSearches.forEach(s => {
      const kw = (s.search_keyword || '').trim();
      if (!kw) return;
      const lower = kw.toLowerCase();
      zeroCounts[lower] = (zeroCounts[lower] || 0) + 1;
    });

    // Build where for successful searches
    const successWhere = {
      total_results: { [Op.gt]: 0 },
      search_keyword: { [Op.and]: [{ [Op.ne]: null }, { [Op.ne]: '' }] }
    };
    if (Object.keys(dateWhere).length > 0) successWhere.search_date = dateWhere;

    const successfulSearches = await models.Search.findAll({
      attributes: ['search_id', 'search_keyword'],
      where: successWhere,
      raw: true
    });

    // For quicker matching, build an array of lowercased successful keywords
    const successfulKeywords = successfulSearches.map(s => String(s.search_keyword || '').toLowerCase());

    const results = [];

    // For each zero-result keyword, check mapping and count matches for synonyms
    for (const [missedLower, missCount] of Object.entries(zeroCounts)) {
      for (const [searchTerm, synonyms] of Object.entries(synonymMappings)) {
        const searchTermLower = searchTerm.toLowerCase();
        if (missedLower.includes(searchTermLower) || searchTermLower.includes(missedLower)) {
          // For each synonym, count how many successful searches contain that synonym string
          for (const synonym of synonyms) {
            const synLower = synonym.toLowerCase();
            const resultCount = successfulKeywords.reduce((acc, k) => acc + (k.includes(synLower) ? 1 : 0), 0);

            if (resultCount > 0) {
              results.push({
                searched_keyword: missedLower,
                expected_synonym: synLower,
                search_count: missCount,
                result_count: resultCount
              });
            }
          }
          // stop checking other mappings for this missed keyword (we matched a mapping)
          break;
        }
      }
    }

    // sort by search_count desc then result_count desc, limit 200
    const out = results
      .sort((a, b) => {
        if (b.search_count !== a.search_count) return b.search_count - a.search_count;
        return b.result_count - a.result_count;
      })
      .slice(0, 200);

    return response.status(200).json(out);
  } catch (error) {
    console.error('Failed to fetch synonym misses:', error);
    return response.status(500).json({ error: 'Failed to fetch synonym miss data' });
  }
};

module.exports = { synonymMissesService };