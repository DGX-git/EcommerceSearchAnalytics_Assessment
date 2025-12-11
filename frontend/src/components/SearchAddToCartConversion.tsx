// import React, { useEffect, useState } from 'react';
// import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface SearchAddToCartData {
//   keyword: string;
//   conversion_rate: number;
//   total_searches: number;
//   unique_customers: number;
//   [key: string]: string | number;
// }

// export const SearchAddToCartConversion: React.FC = () => {
//   const [data, setData] = useState<SearchAddToCartData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'area' | 'bar' | 'table'>('bar');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.searchAddToCartConversion);
        
//         // Handle both array and nested array responses
//         let processedData = Array.isArray(result) ? result : [];
        
//         // If result is an array with metadata object, extract the data array
//         if (Array.isArray(result) && result.length > 0 && result[0] && Array.isArray(result[0])) {
//           processedData = result[0];
//         } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
//           processedData = result[1].rows;
//         }
        
//         // Filter and process data
//         const filteredData = processedData
//           .filter((item: any) => item.keyword && item.keyword.trim() !== '')
//           .map((item: any) => ({
//             keyword: item.keyword,
//             conversion_rate: parseFloat(item.conversion_rate),
//             total_searches: parseInt(item.total_searches, 10),
//             unique_customers: parseInt(item.unique_customers, 10)
//           }))
//           .sort((a: SearchAddToCartData, b: SearchAddToCartData) => b.conversion_rate - a.conversion_rate)
//           .slice(0, 20);
        
//         setData(filteredData);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleChartTypeChange = (
//     event: React.MouseEvent<HTMLElement>,
//     newChartType: 'area' | 'bar' | 'table',
//   ) => {
//     if (newChartType !== null) {
//       setChartType(newChartType);
//     }
//   };

//   const avgConversionRate = data.length > 0 
//     ? (data.reduce((sum, item) => sum + item.conversion_rate, 0) / data.length).toFixed(2)
//     : 0;

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Box>
//             <Typography variant="h5">Search → Add to Cart Conversion</Typography>
//             <Typography variant="caption" color="textSecondary">
//               Avg Conversion Rate: {avgConversionRate}%
//             </Typography>
//           </Box>
//           <ToggleButtonGroup
//             value={chartType}
//             exclusive
//             onChange={handleChartTypeChange}
//             aria-label="chart type"
//           >
//             <ToggleButton value="area" aria-label="area chart">
//               Area Chart
//             </ToggleButton>
//             <ToggleButton value="bar" aria-label="bar chart">
//               Bar Chart
//             </ToggleButton>
//             <ToggleButton value="table" aria-label="table">
//               Table
//             </ToggleButton>
//           </ToggleButtonGroup>
//         </Box>
        
//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
//         {!loading && !error && data.length > 0 && (
//           <>
//             {chartType === 'area' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 100 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
//                     <YAxis label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }} />
//                     <Tooltip 
//                       formatter={(value) => value + '%'}
//                       labelFormatter={(label) => `Keyword: ${label}`}
//                     />
//                     <Legend />
//                     <Area type="monotone" dataKey="conversion_rate" fill="#82ca9d" stroke="#82ca9d" name="Conversion Rate (%)" />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === 'bar' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
//                     <YAxis label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }} />
//                     <Tooltip 
//                       formatter={(value) => value + '%'}
//                       labelFormatter={(label) => `Keyword: ${label}`}
//                     />
//                     <Legend />
//                     <Bar dataKey="conversion_rate" fill="#82ca9d" name="Conversion Rate (%)" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Keyword</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Conversion Rate</TableCell>
//                       <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total Searches</TableCell>
//                       <TableCell align="center" sx={{ fontWeight: 'bold' }}>Unique Customers</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover sx={{ backgroundColor: item.conversion_rate > 50 ? '#e8f5e9' : 'inherit' }}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{item.keyword}</TableCell>
//                         <TableCell align="right">
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <Box sx={{ width: 100 }}>
//                               <LinearProgress
//                                 variant="determinate"
//                                 value={Math.min(item.conversion_rate, 100)}
//                                 sx={{
//                                   height: 8,
//                                   borderRadius: 4,
//                                   backgroundColor: '#e0e0e0',
//                                   '& .MuiLinearProgress-bar': {
//                                     backgroundColor: item.conversion_rate > 50 ? '#4CAF50' : item.conversion_rate > 25 ? '#FFC107' : '#FF6F00'
//                                   }
//                                 }}
//                               />
//                             </Box>
//                             <span>{item.conversion_rate.toFixed(2)}%</span>
//                           </Box>
//                         </TableCell>
//                         <TableCell align="center">{item.total_searches}</TableCell>
//                         <TableCell align="center">{item.unique_customers}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </>
//         )}
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="info">No search to cart conversion data available</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default SearchAddToCartConversion;




// frontend/src/components/SearchAddToCartConversion.tsx
import React, { useEffect, useState } from 'react';
import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface KeywordRow {
  keyword: string;
  searches: number;
  product_views: number;
  add_to_cart: number;
  conversion_rate?: number; // percent
  [k: string]: any;
}

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const SearchAddToCartConversion: React.FC = () => {
  const [rows, setRows] = useState<KeywordRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // date filter states
  const today = new Date();
  const defaultEnd = formatDate(today);
  const defaultStart = formatDate(new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000)); // last 28 days

  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);
  const [appliedStart, setAppliedStart] = useState<string>(defaultStart);
  const [appliedEnd, setAppliedEnd] = useState<string>(defaultEnd);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (appliedStart) params.append('startDate', appliedStart);
        if (appliedEnd) params.append('endDate', appliedEnd);
        const url = `${API_PATHS.searchAddToCartConversion}${params.toString() ? `?${params.toString()}` : ''}`;

        const result: any = await fetchFromAPI(url);

        // Normalize shape:
        // backend may return an array of per-keyword rows OR { aggregateFunnel, keywordFunnel }
        let processed: any[] = [];

        if (!result) {
          processed = [];
        } else if (result.keywordFunnel && Array.isArray(result.keywordFunnel)) {
          processed = result.keywordFunnel;
        } else if (Array.isArray(result)) {
          // database driver shapes: nested arrays or rows property
          if (result.length > 0 && Array.isArray(result[0])) {
            processed = result[0];
          } else if (result.length > 1 && result[1] && result[1].rows) {
            processed = result[1].rows;
          } else {
            processed = result;
          }
        } else if (Array.isArray(result.rows)) {
          processed = result.rows;
        } else {
          processed = [];
        }

        const normalized: KeywordRow[] = (processed || [])
          .filter((r: any) => r && (r.keyword || r.searches !== undefined || r.search_count !== undefined))
          .map((r: any) => {
            const keyword = r.keyword ?? r.search_keyword ?? r.term ?? 'Unknown';
            const searches = Number(r.searches ?? r.search_count ?? r.total_searches ?? 0);
            const product_views = Number(r.product_views ?? r.views ?? r.page_views ?? 0);
            const add_to_cart = Number(r.add_to_cart ?? r.add_to_cart_count ?? r.carts ?? 0);
            const conversion_rate =
              searches > 0 ? parseFloat(((add_to_cart * 100.0) / searches).toFixed(2)) : Number(r.conversion_rate ?? 0);
            return {
              keyword: String(keyword),
              searches,
              product_views,
              add_to_cart,
              conversion_rate,
            } as KeywordRow;
          })
          .sort((a, b) => b.searches - a.searches)
          .slice(0, 200);

        setRows(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appliedStart, appliedEnd]);

  // aggregate funnel data (sum across keywords)
  const aggregate = (() => {
    const totalSearches = rows.reduce((s, r) => s + (r.searches || 0), 0);
    const totalViews = rows.reduce((s, r) => s + (r.product_views || 0), 0);
    const totalAddToCart = rows.reduce((s, r) => s + (r.add_to_cart || 0), 0);

    return [
      { name: 'Search', value: totalSearches },
      { name: 'Product View', value: totalViews },
      { name: 'Add to Cart', value: totalAddToCart },
    ];
  })();

  const onApply = () => {
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
  };

  const onReset = () => {
    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    setAppliedStart(defaultStart);
    setAppliedEnd(defaultEnd);
  };

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5">Search → Add to Cart Conversion</Typography>
            <Typography variant="caption" color="textSecondary">
              Funnel (aggregate) and per-keyword breakdown
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="Start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="End"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button variant="outlined" onClick={onApply} size="small">Apply</Button>
            <Button variant="text" onClick={onReset} size="small">Reset</Button>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <>
            {/* Aggregate funnel chart */}
            <Box sx={{ width: '100%', height: 280, mb: 2 }}>
              {aggregate.reduce((s, a) => s + a.value, 0) === 0 ? (
                <Alert severity="info">No funnel data available for the selected range</Alert>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <Funnel
                      dataKey="value"
                      data={aggregate}
                      isAnimationActive
                      // label={{ position: 'right', formatter: (value: any, name: any) => `${name} (${value})` }}
                    >
                      <LabelList dataKey="name" position="insideTop" />
                    </Funnel>
                    <ReTooltip formatter={(value: any) => `${value}`} />
                  </FunnelChart>
                </ResponsiveContainer>
              )}
            </Box>

            {/* Per-keyword table */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>keyword</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>searches</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>product_views</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>add_to_cart</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>conversion_rate%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No keyword data for the selected range</TableCell>
                    </TableRow>
                  )}
                  {rows.map((r, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{r.keyword}</TableCell>
                      <TableCell align="right">{r.searches}</TableCell>
                      <TableCell align="right">{r.product_views}</TableCell>
                      <TableCell align="right">{r.add_to_cart}</TableCell>
                      <TableCell align="right">
                        {typeof r.conversion_rate === 'number' ? `${r.conversion_rate.toFixed(2)}%` : '0.00%'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchAddToCartConversion;