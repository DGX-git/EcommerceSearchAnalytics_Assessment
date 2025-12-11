// import React, { useEffect, useState } from 'react';
// import {  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, LinearProgress, Rating, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface RatingSensitivityData {
//   rating_range: string;
//   search_count: number;
//   avg_rating: number;
//   percentage: number;
//   [key: string]: string | number;
// }

// const COLORS = ['#ff7c7c', '#ffb347', '#90ee90'];

// export const RatingSensitivity: React.FC = () => {
//   const [data, setData] = useState<RatingSensitivityData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'pie' | 'bar' | 'table'>('pie');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.ratingSensitivity);
        
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
//           .filter((item: any) => item.rating_range && item.rating_range.trim() !== '')
//           .map((item: any) => ({
//             rating_range: item.rating_range,
//             search_count: parseInt(item.search_count, 10),
//             avg_rating: parseFloat(item.avg_rating),
//             percentage: parseFloat(item.percentage)
//           }));
        
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
//     newChartType: 'pie' | 'bar' | 'table',
//   ) => {
//     if (newChartType !== null) {
//       setChartType(newChartType);
//     }
//   };

//   const totalSearches = data.reduce((sum, item) => sum + item.search_count, 0);

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Rating Sensitivity</Typography>
//           <ToggleButtonGroup
//             value={chartType}
//             exclusive
//             onChange={handleChartTypeChange}
//             aria-label="chart type"
//           >
//             <ToggleButton value="pie" aria-label="pie chart">
//               Pie Chart
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
//             {chartType === 'pie' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={data}
//                       dataKey="search_count"
//                       nameKey="rating_range"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={120}
//                       label
//                     >
//                       {data.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === 'bar' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="rating_range" angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="search_count" fill="#8884d8" name="Search Count" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Rating Sensitivity</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Count</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
//                       <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avg Rating</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover>
//                         <TableCell>{item.rating_range}</TableCell>
//                         <TableCell align="right">{item.search_count}</TableCell>
//                         <TableCell align="right">
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <Box sx={{ width: 60 }}>
//                               <LinearProgress
//                                 variant="determinate"
//                                 value={item.percentage}
//                                 sx={{
//                                   height: 8,
//                                   borderRadius: 4,
//                                   backgroundColor: '#e0e0e0',
//                                   '& .MuiLinearProgress-bar': {
//                                     backgroundColor: COLORS[index % COLORS.length]
//                                   }
//                                 }}
//                               />
//                             </Box>
//                             <span>{item.percentage.toFixed(1)}%</span>
//                           </Box>
//                         </TableCell>
//                         <TableCell align="center">
//                           <Rating value={item.avg_rating} max={5} readOnly precision={0.5} size="small" />
//                           <Typography variant="caption">{item.avg_rating.toFixed(2)}</Typography>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </>
//         )}
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="info">No rating sensitivity data available</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default RatingSensitivity;





// frontend/src/components/RatingSensitivity.tsx
import React, { useEffect, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface RatingRow {
  keyword: string;
  avg_rating: number;
  click_rate: number; // percentage 0..100
  conversion_rate: number; // percentage 0..100
  searches?: number;
}

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const RatingSensitivity: React.FC = () => {
  const [data, setData] = useState<RatingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'chart' | 'table'>('chart');

  // date filter states
  const today = new Date();
  const defaultEnd = formatDate(today);
  const defaultStart = formatDate(new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000));

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
        const url = `${API_PATHS.ratingSensitivity}${params.toString() ? `?${params.toString()}` : ''}`;

        const result: any = await fetchFromAPI(url);

        // Normalize result shapes: backend may return ranges or per-keyword rows.
        // We want per-keyword rows. If response has `keyword` entries, use those.
        let processed: any[] = Array.isArray(result) ? result : [];

        if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
          processed = result[0];
        } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
          processed = result[1].rows;
        }

        // If the backend returns rating ranges only (no per-keyword), processed may not contain keyword rows.
        // Normalize per-keyword rows if available.
        const keywordRows: RatingRow[] = (processed || [])
          .filter((r: any) => r && (r.keyword || r.avg_rating !== undefined && r.click_rate !== undefined && r.conversion_rate !== undefined))
          .map((r: any) => {
            // Support different field names
            const keyword = r.keyword ?? r.search_keyword ?? r.term ?? '';
            const avg_rating = Number(r.avg_rating ?? r.average_rating ?? r.rating ?? 0);
            const click_rate = Number(r.click_rate ?? r.clickRate ?? r.click_rate_pct ?? 0);
            const conversion_rate = Number(r.conversion_rate ?? r.conversionRate ?? r.purchase_rate ?? r.conversion_rate_pct ?? 0);
            const searches = Number(r.searches ?? r.search_count ?? r.total_searches ?? 0);

            // If rates are fractions (0..1), convert to percent
            const normalizePercent = (v: number) => (v > 0 && v <= 1 ? v * 100 : v);

            return {
              keyword: String(keyword),
              avg_rating: Number(isNaN(avg_rating) ? 0 : avg_rating),
              click_rate: Number(parseFloat(normalizePercent(click_rate).toFixed(2))),
              conversion_rate: Number(parseFloat(normalizePercent(conversion_rate).toFixed(2))),
              searches,
            } as RatingRow;
          });

        // If no per-keyword rows, try to derive a small set from other shapes (not guaranteed)
        if (keywordRows.length === 0 && Array.isArray(processed)) {
          // fallback: look for nested sample_keywords in items and flatten them
          const flattened: RatingRow[] = [];
          processed.forEach((item: any) => {
            if (item.sample_keywords && Array.isArray(item.sample_keywords)) {
              item.sample_keywords.forEach((sk: any) => {
                const avg_rating = Number(sk.avg_rating ?? sk.rating ?? 0);
                const click_rate = Number(sk.click_rate ?? sk.clickRate ?? 0);
                const conversion_rate = Number(sk.conversion_rate ?? sk.conversionRate ?? 0);
                flattened.push({
                  keyword: sk.keyword ?? sk.search_keyword ?? '',
                  avg_rating,
                  click_rate,
                  conversion_rate,
                });
              });
            }
          });
          if (flattened.length > 0) {
            setData(flattened);
          } else {
            setData([]);
          }
        } else {
          // sort by conversions descending for table default order
          const sorted = keywordRows.sort((a, b) => b.conversion_rate - a.conversion_rate);
          setData(sorted);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appliedStart, appliedEnd]);

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
          <Typography variant="h5">Rating Sensitivity</Typography>

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

            <ToggleButtonGroup value={view} exclusive onChange={(e, v) => v && setView(v)} size="small">
              <ToggleButton value="chart">Scatter</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && view === 'chart' && (
          <Box sx={{ width: '100%', height: 480 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis
                  dataKey="avg_rating"
                  name="Avg Rating"
                  type="number"
                  domain={[0, 5]}
                  label={{ value: 'Avg Rating (0-5)', position: 'bottom', offset: 0 }}
                />
                <YAxis
                  dataKey="conversion_rate"
                  name="Conversion Rate"
                  unit="%"
                  type="number"
                  label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }}
                />
                <ReTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value: any, name: any, props: any) => {
                    if (name === 'conversion_rate' || name === 'click_rate') {
                      return `${value}%`;
                    }
                    return value;
                  }}
                  labelFormatter={() => ''}
                />
                <Scatter
                  name="Keywords"
                  data={data}
                  fill="#8884d8"
                >
                  {/* point size could reflect click_rate (scale) — Recharts Scatter uses 'z' for size if provided */}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </Box>
        )}

        {!loading && !error && data.length > 0 && view === 'table' && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>keyword</strong></TableCell>
                  <TableCell align="right"><strong>avg_rating</strong></TableCell>
                  <TableCell align="right"><strong>click_rate</strong></TableCell>
                  <TableCell align="right"><strong>conversion_rate</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{row.keyword}</TableCell>
                    <TableCell align="right">{row.avg_rating.toFixed(2)}</TableCell>
                    <TableCell align="right">{row.click_rate.toFixed(2)}%</TableCell>
                    <TableCell align="right">{row.conversion_rate.toFixed(2)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No keyword-level rating sensitivity data available for the selected range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingSensitivity;