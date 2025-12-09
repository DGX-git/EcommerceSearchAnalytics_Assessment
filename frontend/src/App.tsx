// import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import Button from '@mui/material/Button';
// import { ScatterChart } from '@mui/x-charts/ScatterChart';
// import { BarChart } from '@mui/x-charts/BarChart';
// import axios from 'axios';

// function App() {



//   const [topSearchVolume, setTopSearchVolume] = useState([{}] as Array<TopSearchVolume>);

//   interface TopSearchVolume {
//     searchTerm: string;
//     count: number;
//   }



//   useEffect(() => {
//         // Make GET request to fetch data
//         axios
//             .get("http://localhost:5000/data/topSearchVolume")
//             .then((response) => {
//                 setTopSearchVolume(response.data);
//                 // setLoading(false);
//             })
//             .catch((err) => {
//                 // setError(err.message);
//                 // setLoading(false);
//             });
//     }, []);



// const data = [
//   {
//     y1: 443.28,
//     y2: 153.9,
//   },
//   {
//     y1: 110.5,
//     y2: 217.8,
//   },
//   {
//     y1: 175.23,
//     y2: 286.32,
//   },
//   {
//     y1: 195.97,
//     y2: 325.12,
//   },
//   {
//     y1: 351.77,
//     y2: 144.58,
//   },
//   {
//     y1: 43.253,
//     y2: 146.51,
//   },
//   {
//     y1: 376.34,
//     y2: 309.69,
//   },
//   {
//     y1: 31.514,
//     y2: 236.38,
//   },
//   {
//     y1: 231.31,
//     y2: 440.72,
//   },
//   {
//     y1: 108.04,
//     y2: 20.29,
//   },
//   {
//     y1: 321.77,
//     y2: 484.17,
//   },
//   {
//     y1: 120.18,
//     y2: 54.962,
//   },
//   {
//     y1: 366.2,
//     y2: 418.5,
//   },
//   {
//     y1: 451.45,
//     y2: 181.32,
//   },
//   {
//     y1: 294.8,
//     y2: 440.9,
//   },
//   {
//     y1: 121.83,
//     y2: 273.52,
//   },
//   {
//     y1: 287.7,
//     y2: 346.7,
//   },
//   {
//     y1: 134.06,
//     y2: 74.528,
//   },
//   {
//     y1: 104.5,
//     y2: 150.9,
//   },
//   {
//     y1: 413.07,
//     y2: 26.483,
//   },
//   {
//     y1: 74.68,
//     y2: 333.2,
//   },
//   {
//     y1: 360.6,
//     y2: 422.0,
//   },
//   {
//     y1: 330.72,
//     y2: 488.06,
//   },
// ];

// const series = [
//   {
//     label: 'Series A',
//     data: data.map((v) => v.y1),
//   },
//   {
//     label: 'Series B',
//     data: data.map((v) => v.y2),
//   },
// ];











//   return (
//     <div className="App">
//       <BarChart
//       height={300}
//       xAxis={[{ data: topSearchVolume.map((v, i) => i) }]}
//       series={series}
//     />
//     </div>
//   );
// }


// export default App;


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
    { path: '/users', label: 'Users', icon: '👤' },
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
            <Route path="/users" element={<Users />} />
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