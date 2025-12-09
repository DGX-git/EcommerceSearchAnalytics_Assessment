import routes from './index';

// Generic API fetch helper
const fetchFromAPI = async <T,>(endpoint: string): Promise<T> => {
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

// Analytics API Services
export const analyticsAPI = {
  getTopSearchVolume: () => fetchFromAPI(routes.topSearchVolume),
  getTrendingKeywords: () => fetchFromAPI(routes.trendingKeywords),
  getAttributeTrends: () => fetchFromAPI(routes.attributeTrends),
  getBrandSearchVolume: () => fetchFromAPI(routes.brandSearchVolume),
  getCategoryDemand: () => fetchFromAPI(routes.categoryDemand),
  getCategoryOrCollectionMappingAccuracy: () => fetchFromAPI(routes.categoryOrCollectionMappingAccuracy),
  getConversionIntentFunnel: () => fetchFromAPI(routes.conversionIntentFunnel),
  getCrossSearchPatterns: () => fetchFromAPI(routes.crossSearchPatterns),
  getHighExitSearches: () => fetchFromAPI(routes.highExitSearches),
  getKeywordClustering: () => fetchFromAPI(routes.keywordClustering),
  getLowResultSearches: () => fetchFromAPI(routes.lowResultSearches),
  getNewVsReturningCustomerSearches: () => fetchFromAPI(routes.newVsReturningCustomerSearches),
  getPriceIntentSegments: () => fetchFromAPI(routes.priceIntentSegments),
  getRatingSensitivity: () => fetchFromAPI(routes.ratingSensitivity),
  getSearchAddToCartConversion: () => fetchFromAPI(routes.searchAddToCartConversion),
  getSearchByLocationOrRegion: () => fetchFromAPI(routes.searchByLocationOrRegion),
  getSearchFailRate: () => fetchFromAPI(routes.searchFailRate),
  getSeasonalityTrends: () => fetchFromAPI(routes.seasonalityTrends),
  getSynonymMisses: () => fetchFromAPI(routes.synonymMisses),
  getZeroResultsSearches: () => fetchFromAPI(routes.zeroResultsSearches),
};

export default analyticsAPI;
