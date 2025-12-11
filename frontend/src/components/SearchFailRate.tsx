// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface SearchFailRateData {
//   keyword: string;
//   fail_rate: number;
//   total_searches: number;
//   failed_searches: number;
//   zero_result_count: number;
//   low_result_count: number;
//   low_rating_count: number;
//   [key: string]: string | number;
// }

// export const SearchFailRate: React.FC = () => {
//   const [data, setData] = useState<SearchFailRateData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'line' | 'bar' | 'table'>('bar');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.searchFailRate);
        
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
//             fail_rate: parseFloat(item.fail_rate),
//             total_searches: parseInt(item.total_searches, 10),
//             failed_searches: parseInt(item.failed_searches, 10),
//             zero_result_count: parseInt(item.zero_result_count, 10),
//             low_result_count: parseInt(item.low_result_count, 10),
//             low_rating_count: parseInt(item.low_rating_count, 10)
//           }))
//           .sort((a: SearchFailRateData, b: SearchFailRateData) => b.fail_rate - a.fail_rate)
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
//     newChartType: 'line' | 'bar' | 'table',
//   ) => {
//     if (newChartType !== null) {
//       setChartType(newChartType);
//     }
//   };

//   const avgFailRate = data.length > 0 
//     ? (data.reduce((sum, item) => sum + item.fail_rate, 0) / data.length).toFixed(2)
//     : 0;

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Box>
//             <Typography variant="h5">Search Fail Rate</Typography>
//             <Typography variant="caption" color="textSecondary">
//               Avg Fail Rate: {avgFailRate}%
//             </Typography>
//           </Box>
//           <ToggleButtonGroup
//             value={chartType}
//             exclusive
//             onChange={handleChartTypeChange}
//             aria-label="chart type"
//           >
//             <ToggleButton value="line" aria-label="line chart">
//               Line Chart
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
//             {chartType === 'line' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 100 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
//                     <YAxis label={{ value: 'Fail Rate (%)', angle: -90, position: 'insideLeft' }} />
//                     <Tooltip 
//                       formatter={(value) => value + '%'}
//                       labelFormatter={(label) => `Keyword: ${label}`}
//                     />
//                     <Legend />
//                     <Line 
//                       type="monotone" 
//                       dataKey="fail_rate" 
//                       stroke="#ff7c7c" 
//                       strokeWidth={2} 
//                       dot={{ fill: '#ff7c7c' }} 
//                       name="Fail Rate (%)"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === 'bar' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
//                     <YAxis label={{ value: 'Fail Rate (%)', angle: -90, position: 'insideLeft' }} />
//                     <Tooltip 
//                       formatter={(value) => value + '%'}
//                       labelFormatter={(label) => `Keyword: ${label}`}
//                     />
//                     <Legend />
//                     <Bar dataKey="fail_rate" fill="#ff7c7c" name="Fail Rate (%)" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Keyword</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Fail Rate</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Failed/Total</TableCell>
//                       <TableCell align="center" sx={{ fontWeight: 'bold' }}>Zero Results</TableCell>
//                       <TableCell align="center" sx={{ fontWeight: 'bold' }}>Low Results</TableCell>
//                       <TableCell align="center" sx={{ fontWeight: 'bold' }}>Low Rating</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover sx={{ backgroundColor: item.fail_rate > 50 ? '#ffebee' : 'inherit' }}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{item.keyword}</TableCell>
//                         <TableCell align="right">
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <Box sx={{ width: 80 }}>
//                               <LinearProgress
//                                 variant="determinate"
//                                 value={Math.min(item.fail_rate, 100)}
//                                 sx={{
//                                   height: 8,
//                                   borderRadius: 4,
//                                   backgroundColor: '#e0e0e0',
//                                   '& .MuiLinearProgress-bar': {
//                                     backgroundColor: item.fail_rate > 75 ? '#D32F2F' : item.fail_rate > 50 ? '#F57C00' : item.fail_rate > 25 ? '#FBC02D' : '#388E3C'
//                                   }
//                                 }}
//                               />
//                             </Box>
//                             <span>{item.fail_rate.toFixed(1)}%</span>
//                           </Box>
//                         </TableCell>
//                         <TableCell align="right">
//                           {item.failed_searches}/{item.total_searches}
//                         </TableCell>
//                         <TableCell align="center">
//                           {item.zero_result_count > 0 && (
//                             <Chip label={item.zero_result_count} size="small" color="error" variant="outlined" />
//                           )}
//                         </TableCell>
//                         <TableCell align="center">
//                           {item.low_result_count > 0 && (
//                             <Chip label={item.low_result_count} size="small" color="warning" variant="outlined" />
//                           )}
//                         </TableCell>
//                         <TableCell align="center">
//                           {item.low_rating_count > 0 && (
//                             <Chip label={item.low_rating_count} size="small" variant="outlined" />
//                           )}
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
//           <Alert severity="info">No search fail rate data available</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default SearchFailRate;




import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  LinearProgress,
} from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface SearchFailRateData {
  keyword: string;
  fail_count: number;
  total_searches: number;
  fail_rate: number; // percent
  [key: string]: any;
}

const COLORS = ['#d32f2f', '#ff7c7c', '#ffb74d', '#ffd54f', '#aed581', '#81c784', '#4caf50'];

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const SearchFailRate: React.FC = () => {
  const [data, setData] = useState<SearchFailRateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'chart' | 'table'>('chart');

  // date defaults: last 28 days
  const today = new Date();
  const defaultEnd = formatDate(today);
  const defaultStart = formatDate(new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000));

  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);
  const [appliedStart, setAppliedStart] = useState<string>(defaultStart);
  const [appliedEnd, setAppliedEnd] = useState<string>(defaultEnd);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (appliedStart) params.append('startDate', appliedStart);
        if (appliedEnd) params.append('endDate', appliedEnd);
        const url = `${API_PATHS.searchFailRate}${params.toString() ? `?${params.toString()}` : ''}`;

        const res: any = await fetchFromAPI(url);

        // normalize possible driver shapes
        let rows: any[] = [];
        if (!res) rows = [];
        else if (Array.isArray(res)) {
          if (res.length > 0 && Array.isArray(res[0])) rows = res[0];
          else if (res.length > 1 && res[1] && res[1].rows) rows = res[1].rows;
          else rows = res;
        } else if (res.rows && Array.isArray(res.rows)) rows = res.rows;
        else if (Array.isArray(res.data)) rows = res.data;
        else rows = Array.isArray(res) ? res : [];

        const normalized: SearchFailRateData[] = (rows || [])
          .filter((r: any) => r && (r.keyword || r.search_keyword))
          .map((r: any) => {
            const keyword = r.keyword ?? r.search_keyword ?? 'Unknown';
            const fail_count = Number(r.fail_count ?? r.failed_searches ?? r.failed_searches_count ?? r.failed_searches_total ?? 0) || 0;
            const total_searches = Number(r.total_searches ?? r.search_count ?? r.total_searches_count ?? 0) || 0;
            const fail_rate = total_searches > 0 ? parseFloat(((fail_count * 100.0) / total_searches).toFixed(2)) : parseFloat((r.fail_rate ?? 0).toString()) || 0;
            return {
              keyword: String(keyword),
              fail_count,
              total_searches,
              fail_rate,
            };
          })
          .sort((a, b) => b.fail_rate - a.fail_rate)
          .slice(0, 50);

        setData(normalized);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [appliedStart, appliedEnd]);

  const totalFailures = data.reduce((s, r) => s + (r.fail_count || 0), 0);
  const totalSearches = data.reduce((s, r) => s + (r.total_searches || 0), 0);
  const overallFailRate = totalSearches > 0 ? parseFloat(((totalFailures * 100.0) / totalSearches).toFixed(2)) : 0;

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
            <Typography variant="h5">Search Fail Rate</Typography>
            <Typography variant="caption" color="textSecondary">Shows overall health of search engine</Typography>
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

            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(_, nv) => nv !== null && setView(nv)}
              size="small"
            >
              <ToggleButton value="chart">Chart</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <>
            {/* Top summary gauge */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: 72, height: 72, position: 'relative' }}>
                <CircularProgress
                  variant="determinate"
                  value={Math.min(Math.max(overallFailRate, 0), 100)}
                  size={72}
                  thickness={6}
                  sx={{
                    color: overallFailRate > 50 ? '#d32f2f' : overallFailRate > 25 ? '#ffb74d' : '#81c784',
                  }}
                />
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption">{overallFailRate}%</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle1">Overall Fail Rate</Typography>
                <Typography variant="caption">{totalFailures} failed / {totalSearches} total</Typography>
              </Box>
            </Box>

            {view === 'chart' && data.length > 0 && (
              <Box sx={{ width: '100%', height: 360, mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={80} interval={0} />
                    <YAxis label={{ value: 'Fail Rate (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                    <Bar dataKey="fail_rate" fill="#d32f2f" name="Fail Rate (%)">
                      {data.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {/* Table matching requested schema */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Keyword</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Fail Count</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Searches</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Fail Rate%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No data for selected range</TableCell>
                    </TableRow>
                  )}
                  {data.map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{row.keyword}</TableCell>
                      <TableCell align="right">{row.fail_count}</TableCell>
                      <TableCell align="right">{row.total_searches}</TableCell>
                      <TableCell align="right">{row.fail_rate.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>No search fail rate data available</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchFailRate;