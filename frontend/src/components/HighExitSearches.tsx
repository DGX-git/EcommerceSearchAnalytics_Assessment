// import React, { useEffect, useState } from 'react';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface HighExitSearchesData {
//   keyword: string;
//   exit_rate: number;
//   total_searches: number;
//   zero_result_searches: number;
//   low_result_searches: number;
//   [key: string]: string | number;
// }

// export const HighExitSearches: React.FC = () => {
//   const [data, setData] = useState<HighExitSearchesData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'area' | 'bar' | 'table'>('area');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.highExitSearches);
        
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
//             exit_rate: parseFloat(item.exit_rate),
//             total_searches: parseInt(item.total_searches, 10),
//             zero_result_searches: parseInt(item.zero_result_searches, 10),
//             low_result_searches: parseInt(item.low_result_searches, 10)
//           }))
//           .sort((a: HighExitSearchesData, b: HighExitSearchesData) => b.exit_rate - a.exit_rate)
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

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">High-Exit Searches</Typography>
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
//                     <YAxis label={{ value: 'Exit Rate (%)', angle: -90, position: 'insideLeft' }} />
//                     <Tooltip 
//                       formatter={(value) => value + '%'}
//                       labelFormatter={(label) => `Keyword: ${label}`}
//                     />
//                     <Legend />
//                     <Area type="monotone" dataKey="exit_rate" fill="#ff7300" stroke="#ff7300" name="Exit Rate (%)" />
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
//                     <YAxis label={{ value: 'Exit Rate (%)', angle: -90, position: 'insideLeft' }} />
//                     <Tooltip 
//                       formatter={(value) => value + '%'}
//                       labelFormatter={(label) => `Keyword: ${label}`}
//                     />
//                     <Legend />
//                     <Bar dataKey="exit_rate" fill="#ff7300" name="Exit Rate (%)" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {/* {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Keyword</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Exit Rate</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Searches</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Zero Results</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Low Results (&lt;5)</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover sx={{ backgroundColor: item.exit_rate > 50 ? '#ffebee' : 'inherit' }}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{item.keyword}</TableCell>
//                         <TableCell align="right">
//                           <Chip
//                             label={item.exit_rate.toFixed(2) + '%'}
//                             color={item.exit_rate > 75 ? 'error' : item.exit_rate > 50 ? 'warning' : 'default'}
//                             size="small"
//                           />
//                         </TableCell>
//                         <TableCell align="right">{item.total_searches}</TableCell>
//                         <TableCell align="right">{item.zero_result_searches}</TableCell>
//                         <TableCell align="right">{item.low_result_searches}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )} */}
//           </>
//         )}
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="success">No high-exit searches detected. User engagement is good!</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default HighExitSearches;




// frontend/src/components/HighExitSearches.tsx
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

interface HighExitSearchesData {
  keyword: string;
  exit_rate: number; // fraction or percentage depending on backend; we'll treat as percent (0-100)
  total_searches: number;
  exits: number;
  [key: string]: string | number;
}

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const HighExitSearches: React.FC = () => {
  const [data, setData] = useState<HighExitSearchesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'bar' | 'table'>('bar');

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
        const url = `${API_PATHS.highExitSearches}${params.toString() ? `?${params.toString()}` : ''}`;

        const result: any = await fetchFromAPI(url);

        // Normalize response shapes (support raw array or nested DB driver shapes)
        let processed: any[] = Array.isArray(result) ? result : [];
        if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
          processed = result[0];
        } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
          processed = result[1].rows;
        }

        const normalized = processed
          .filter((item: any) => item && item.keyword && String(item.keyword).trim() !== '')
          .map((item: any) => {
            const exits = Number(item.exits ?? item.exit_searches ?? item.exit_search_count ?? 0);
            const total_searches = Number(item.total_searches ?? item.total_search ?? item.search_count ?? 0);
            // backend may return exit_rate as fraction (0..1) or percentage (0..100)
            let exit_rate = Number(item.exit_rate ?? item.exit_rate_pct ?? 0);
            if (exit_rate > 0 && exit_rate <= 1) {
              exit_rate = parseFloat((exit_rate * 100).toFixed(2)); // convert fraction to percent
            } else {
              exit_rate = parseFloat(exit_rate.toFixed(2));
            }

            return {
              keyword: String(item.keyword),
              exit_rate,
              total_searches,
              exits
            } as HighExitSearchesData;
          })
          .sort((a, b) => b.exit_rate - a.exit_rate)
          .slice(0, 50);

        setData(normalized);
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

  // Colors: highlight very high exit rates
  const getColor = (rate: number) => {
    if (rate >= 75) return '#d32f2f';
    if (rate >= 50) return '#ff9800';
    return '#1976d2';
  };

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">High-Exit Searches</Typography>

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

            <ToggleButtonGroup value={view} exclusive onChange={(e, val) => val && setView(val)} size="small">
              <ToggleButton value="bar">Bar</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && view === 'bar' && (
          <Box sx={{ width: '100%', height: 520 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 150 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="keyword" angle={-65} textAnchor="end" height={140} interval={0} />
                <YAxis label={{ value: 'Exit Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: any) => `${value}%`} />
                <Bar dataKey="exit_rate" name="Exit Rate (%)">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry.exit_rate)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        {!loading && !error && data.length > 0 && view === 'table' && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>keyword</strong></TableCell>
                  <TableCell align="right"><strong>exit_rate%</strong></TableCell>
                  <TableCell align="right"><strong>total_searches</strong></TableCell>
                  <TableCell align="right"><strong>exits</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{row.keyword}</TableCell>
                    <TableCell align="right" sx={{ color: row.exit_rate >= 75 ? '#d32f2f' : row.exit_rate >= 50 ? '#ff9800' : 'inherit', fontWeight: 'bold' }}>
                      {row.exit_rate.toFixed(2)}%
                    </TableCell>
                    <TableCell align="right">{row.total_searches}</TableCell>
                    <TableCell align="right">{row.exits}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No high-exit searches detected for the selected range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default HighExitSearches;