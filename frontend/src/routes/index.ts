// API Routes Configuration
// Maps frontend routes to backend API endpoints

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/data';

export const routes = {
  // Analytics Routes
  topSearchVolume: `${API_BASE_URL}/topSearchVolume`,
  trendingKeywords: `${API_BASE_URL}/trendingKeywords`,
  attributeTrends: `${API_BASE_URL}/attributeTrends`,
  brandSearchVolume: `${API_BASE_URL}/brandSearchVolume`,
  categoryDemand: `${API_BASE_URL}/categoryDemand`,
  categoryOrCollectionMappingAccuracy: `${API_BASE_URL}/catergoryOrCollectionMappingAccuracy`,
  conversionIntentFunnel: `${API_BASE_URL}/conversionIntentFunnel`,
  crossSearchPatterns: `${API_BASE_URL}/crossSearchPatterns`,
  highExitSearches: `${API_BASE_URL}/highExitSearches`,
  keywordClustering: `${API_BASE_URL}/keywordClustering`,
  lowResultSearches: `${API_BASE_URL}/lowResultSearches`,
  newVsReturningCustomerSearches: `${API_BASE_URL}/newVsReturningCustomerSearches`,
  priceIntentSegments: `${API_BASE_URL}/priceIntentSegments`,
  ratingSensitivity: `${API_BASE_URL}/ratingSensitivity`,
  searchAddToCartConversion: `${API_BASE_URL}/searchAddToCartConversion`,
  searchByLocationOrRegion: `${API_BASE_URL}/searchByLocationOrRegion`,
  searchFailRate: `${API_BASE_URL}/searchFailRate`,
  seasonalityTrends: `${API_BASE_URL}/seasonalityTrends`,
  synonymMisses: `${API_BASE_URL}/synonymMisses`,
  zeroResultsSearches: `${API_BASE_URL}/zeroResultsSearches`,
  
  // User Routes
  users: `${API_BASE_URL}/users`,
};

export default routes;
