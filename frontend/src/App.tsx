import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Button, Container, Grid, Paper, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

// Import all components
import { TopSearchVolume } from './components/TopSearchVolume';
import { TrendingKeywords } from './components/TrendingKeywords';
import { default as AttributeTrends } from './components/AttributeTrends';
import { BrandSearchVolume } from './components/BrandSearchVolume';
import { default as CategoryDemand } from './components/CategoryDemand';
import { default as CategoryOrCollectionMappingAccuracy } from './components/CategoryOrCollectionMappingAccuracy';
import { default as ConversionIntentFunnel } from './components/ConversionIntentFunnel';
import { default as CrossSearchPatterns } from './components/CrossSearchPatterns';
import { default as HighExitSearches } from './components/HighExitSearches';
import { default as KeywordClustering } from './components/KeywordClustering';
import { default as LowResultSearches } from './components/LowResultSearches';
import { default as NewVsReturningCustomerSearches } from './components/NewVsReturningCustomerSearches';
import { PriceIntentSegments } from './components/PriceIntentSegments';
import { RatingSensitivity } from './components/RatingSensitivity';
import { SearchAddToCartConversion } from './components/SearchAddToCartConversion';
import { SearchByLocationOrRegion } from './components/SearchByLocationOrRegion';
import { SearchFailRate } from './components/SearchFailRate';
import { SeasonalityTrends } from './components/SeasonalityTrends';
import { SynonymMisses } from './components/SynonymMisses';
import { ZeroResultsSearches } from './components/ZeroResultsSearches';
import { Users } from './components/Users';

// Home Component
const Home: React.FC = () => {
  const routes = [
    { path: '/topSearchVolume', label: 'Top Search Volume' },
    { path: '/trendingKeywords', label: 'Trending Keywords' },
    { path: '/attributeTrends', label: 'Attribute Trends' },
    { path: '/brandSearchVolume', label: 'Brand Search Volume' },
    { path: '/categoryDemand', label: 'Category Demand' },
    { path: '/catergoryOrCollectionMappingAccuracy', label: 'Category/Collection Mapping' },
    { path: '/conversionIntentFunnel', label: 'Conversion Intent Funnel' },
    { path: '/crossSearchPatterns', label: 'Cross Search Patterns' },
    { path: '/highExitSearches', label: 'High Exit Searches' },
    { path: '/keywordClustering', label: 'Keyword Clustering' },
    { path: '/lowResultSearches', label: 'Low Result Searches' },
    { path: '/newVsReturningCustomerSearches', label: 'New vs Returning Customers' },
    { path: '/priceIntentSegments', label: 'Price Intent Segments' },
    { path: '/ratingSensitivity', label: 'Rating Sensitivity' },
    { path: '/searchAddToCartConversion', label: 'Search to Cart Conversion' },
    { path: '/searchByLocationOrRegion', label: 'Search by Location/Region' },
    { path: '/searchFailRate', label: 'Search Fail Rate' },
    { path: '/seasonalityTrends', label: 'Seasonality Trends' },
    { path: '/synonymMisses', label: 'Synonym Misses' },
    { path: '/zeroResultsSearches', label: 'Zero Results Searches' },
    // { path: '/users', label: 'Users' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
          🛍️ E-Commerce Search Analytics Dashboard
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Explore comprehensive search and analytics insights
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {routes.map((route) => (
          <Link key={route.path} to={route.path} style={{ textDecoration: 'none', color: '#1976d2' }}>
            {route.label}
          </Link>
        ))}
      </Box>
    </Container>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navigation Bar */}
        <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
          <Toolbar>
            <DashboardIcon sx={{ mr: 2, fontSize: 28 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Analytics Dashboard
            </Typography>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button color="inherit" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                🏠 Home
              </Button>
            </Link>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ flex: 1, backgroundColor: '#f9f9f9', py: 2 }}>
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
            {/* <Route path="/users" element={<Users />} /> */}
          </Routes>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            backgroundColor: '#1976d2',
            color: 'white',
            textAlign: 'center',
            py: 2,
            mt: 4,
          }}
        >
          <Typography variant="body2">
            © 2025 E-Commerce Search Analytics. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Router>
  );
}

export default App;