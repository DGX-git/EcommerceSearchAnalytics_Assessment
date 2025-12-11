// import React, { useEffect, useState } from 'react';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface LowResultSearchesData {
//   keyword: string;
//   avg_result_count: number;
//   search_count: number;
//   min_results: number;
//   max_results: number;
//   [key: string]: string | number;
// }

// export const LowResultSearches: React.FC = () => {
//   const [data, setData] = useState<LowResultSearchesData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'area' | 'bar' | 'table'>('area');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.lowResultSearches);
        
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
//             avg_result_count: parseFloat(item.avg_result_count),
//             search_count: parseInt(item.search_count, 10),
//             min_results: parseInt(item.min_results, 10),
//             max_results: parseInt(item.max_results, 10)
//           }))
//           .sort((a: LowResultSearchesData, b: LowResultSearchesData) => a.avg_result_count - b.avg_result_count)
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
//           <Typography variant="h5">Low-Result Searches (Less than 5 products)</Typography>
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
//                     <YAxis />
//                     <Tooltip formatter={(value) => value} />
//                     <Legend />
//                     <Area type="monotone" dataKey="avg_result_count" fill="#ffc658" stroke="#ffc658" name="Avg Result Count" />
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
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="avg_result_count" fill="#ffc658" name="Avg Result Count" />
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
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Avg Results</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Min Results</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Max Results</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Count</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover sx={{ backgroundColor: item.avg_result_count < 2 ? '#fff3cd' : 'inherit' }}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{item.keyword}</TableCell>
//                         <TableCell align="right">{item.avg_result_count.toFixed(2)}</TableCell>
//                         <TableCell align="right">{item.min_results}</TableCell>
//                         <TableCell align="right">{item.max_results}</TableCell>
//                         <TableCell align="right">{item.search_count}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )} */}
//           </>
//         )}
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="success">No low-result searches found. Great catalog coverage!</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default LowResultSearches;




// frontend/src/components/LowResultSearches.tsx
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

interface LowResultSearchesData {
  keyword: string;
  result_count: number;    // average result count per search (displayed as result_count)
  search_count: number;
  [key: string]: any;
}

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const LowResultSearches: React.FC = () => {
  const [data, setData] = useState<LowResultSearchesData[]>([]);
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
        const url = `${API_PATHS.lowResultSearches}${params.toString() ? `?${params.toString()}` : ''}`;

        const result: any = await fetchFromAPI(url);

        // Normalize response shapes (flat array, nested driver shapes)
        let processed: any[] = Array.isArray(result) ? result : [];
        if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
          processed = result[0];
        } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
          processed = result[1].rows;
        }

        const normalized = (processed || [])
          .filter((item: any) => item && item.keyword && String(item.keyword).trim() !== '')
          .map((item: any) => {
            // Backend may return avg_result_count or avgResults; normalize to result_count (percentage-like numeric)
            const avg = Number(item.avg_result_count ?? item.result_count ?? item.avgResults ?? 0);
            const searchCount = Number(item.search_count ?? item.searchCount ?? item.search_count ?? 0);

            return {
              keyword: String(item.keyword),
              result_count: Number(isNaN(avg) ? 0 : parseFloat(avg.toFixed(2))),
              search_count: Number(isNaN(searchCount) ? 0 : searchCount),
            } as LowResultSearchesData;
          })
          .sort((a, b) => a.result_count - b.result_count) // lowest result_count first
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

  const getBarColor = (v: number) => {
    if (v < 1) return '#ff7043';
    if (v < 3) return '#ffb74d';
    return '#64b5f6';
  };

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Low-Result Searches (keywords with limited results)</Typography>

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
              <ToggleButton value="bar">Bar</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && view === 'bar' && (
          <Box sx={{ width: '100%', height: 480 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 150 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="keyword" angle={-65} textAnchor="end" height={140} interval={0} />
                <YAxis label={{ value: 'Avg Result Count', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(val: any) => `${val}`} />
                <Bar dataKey="result_count" name="result_count">
                  {data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={getBarColor(entry.result_count)} />
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
                  <TableCell align="right"><strong>search_count</strong></TableCell>
                  <TableCell align="right"><strong>result_count</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{row.keyword}</TableCell>
                    <TableCell align="right">{row.search_count}</TableCell>
                    <TableCell align="right">{row.result_count.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No low-result searches found for the selected range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default LowResultSearches;