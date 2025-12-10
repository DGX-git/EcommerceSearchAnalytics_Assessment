import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, AppBar, Toolbar, Button, Container, Grid, Paper, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

// Import all components
import { TopSearchVolume } from './components/TopSearchVolume';
import { TrendingKeywords } from './components/TrendingKeywords';
import { AttributeTrends } from './components/AttributeTrends';
import { BrandSearchVolume } from './components/BrandSearchVolume';
import { CategoryDemand } from './components/CategoryDemand';
import { CategoryOrCollectionMappingAccuracy } from './components/CategoryOrCollectionMappingAccuracy';
import { ConversionIntentFunnel } from './components/ConversionIntentFunnel';
import { CrossSearchPatterns } from './components/CrossSearchPatterns';
import { HighExitSearches } from './components/HighExitSearches';
import { KeywordClustering } from './components/KeywordClustering';
import { LowResultSearches } from './components/LowResultSearches';
import { NewVsReturningCustomerSearches } from './components/NewVsReturningCustomerSearches';
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
    { path: '/topSearchVolume', label: 'Top Search Volume', icon: '📊' },
    { path: '/trendingKeywords', label: 'Trending Keywords', icon: '🔥' },
    { path: '/attributeTrends', label: 'Attribute Trends', icon: '📈' },
    { path: '/brandSearchVolume', label: 'Brand Search Volume', icon: '🏢' },
    { path: '/categoryDemand', label: 'Category Demand', icon: '📦' },
    { path: '/catergoryOrCollectionMappingAccuracy', label: 'Category/Collection Mapping', icon: '🎯' },
    { path: '/conversionIntentFunnel', label: 'Conversion Intent Funnel', icon: '🔗' },
    { path: '/crossSearchPatterns', label: 'Cross Search Patterns', icon: '🔄' },
    { path: '/highExitSearches', label: 'High Exit Searches', icon: '🚪' },
    { path: '/keywordClustering', label: 'Keyword Clustering', icon: '🔤' },
    { path: '/lowResultSearches', label: 'Low Result Searches', icon: '❌' },
    { path: '/newVsReturningCustomerSearches', label: 'New vs Returning Customers', icon: '👥' },
    { path: '/priceIntentSegments', label: 'Price Intent Segments', icon: '💰' },
    { path: '/ratingSensitivity', label: 'Rating Sensitivity', icon: '⭐' },
    { path: '/searchAddToCartConversion', label: 'Search to Cart Conversion', icon: '🛒' },
    { path: '/searchByLocationOrRegion', label: 'Search by Location/Region', icon: '🗺️' },
    { path: '/searchFailRate', label: 'Search Fail Rate', icon: '⚠️' },
    { path: '/seasonalityTrends', label: 'Seasonality Trends', icon: '📅' },
    { path: '/synonymMisses', label: 'Synonym Misses', icon: '🔍' },
    { path: '/zeroResultsSearches', label: 'Zero Results Searches', icon: '0️⃣' },
    // { path: '/users', label: 'Users', icon: '👤' },
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

      <Grid container spacing={2}>
        {routes.map((route) => (
          <Grid  key={route.path}>
            <Link to={route.path} style={{ textDecoration: 'none' }}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-8px)',
                    backgroundColor: '#f5f5f5',
                  },
                  minHeight: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  border: '1px solid #e0e0e0',
                }}
              >
                <Box sx={{ fontSize: '2rem', mb: 1 }}>{route.icon}</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {route.label}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
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