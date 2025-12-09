import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../Home';
import {
  TopSearchVolume,
  TrendingKeywords,
  AttributeTrends,
  BrandSearchVolume,
  CategoryDemand,
  CategoryOrCollectionMappingAccuracy,
  ConversionIntentFunnel,
  CrossSearchPatterns,
  HighExitSearches,
  KeywordClustering,
  LowResultSearches,
  NewVsReturningCustomerSearches,
  PriceIntentSegments,
  RatingSensitivity,
  SearchAddToCartConversion,
  SearchByLocationOrRegion,
  SearchFailRate,
  SeasonalityTrends,
  SynonymMisses,
  ZeroResultsSearches,
  Users,
} from '../components';

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/topSearchVolume" element={<TopSearchVolume />} />
        <Route path="/trendingKeywords" element={<TrendingKeywords />} />
        <Route path="/attributeTrends" element={<AttributeTrends />} />
        <Route path="/brandSearchVolume" element={<BrandSearchVolume />} />
        <Route path="/categoryDemand" element={<CategoryDemand />} />
        <Route path="/catergoryOrCollectionMappingAccuracy" element={<CategoryOrCollectionMappingAccuracy />} />
        <Route path="/conversionIntentFunnel" element={<ConversionIntentFunnel />} />
        <Route path="/crossSearchPatterns" element={<CrossSearchPatterns />} />
        <Route path="/highExitSearches" element={<HighExitSearches />} />
        <Route path="/keywordClustering" element={<KeywordClustering />} />
        <Route path="/lowResultSearches" element={<LowResultSearches />} />
        <Route path="/newVsReturningCustomerSearches" element={<NewVsReturningCustomerSearches />} />
        <Route path="/priceIntentSegments" element={<PriceIntentSegments />} />
        <Route path="/ratingSensitivity" element={<RatingSensitivity />} />
        <Route path="/searchAddToCartConversion" element={<SearchAddToCartConversion />} />
        <Route path="/searchByLocationOrRegion" element={<SearchByLocationOrRegion />} />
        <Route path="/searchFailRate" element={<SearchFailRate />} />
        <Route path="/seasonalityTrends" element={<SeasonalityTrends />} />
        <Route path="/synonymMisses" element={<SynonymMisses />} />
        <Route path="/zeroResultsSearches" element={<ZeroResultsSearches />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
