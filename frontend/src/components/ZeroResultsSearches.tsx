// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface ZeroResultSearchData {
//   keyword: string;
//   count: number;
//   [key: string]: string | number;
// }

// export const ZeroResultsSearches: React.FC = () => {
//   const [data, setData] = useState<ZeroResultSearchData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'bar' | 'table'>('bar');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.zeroResultsSearches);
        
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
//             count: parseInt(item.count, 10)
//           }))
//           .sort((a: ZeroResultSearchData, b: ZeroResultSearchData) => b.count - a.count)
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
//     newChartType: 'bar' | 'table',
//   ) => {
//     if (newChartType !== null) {
//       setChartType(newChartType);
//     }
//   };

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Zero-Result Searches</Typography>
//           <ToggleButtonGroup
//             value={chartType}
//             exclusive
//             onChange={handleChartTypeChange}
//             aria-label="chart type"
//           >
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
//             {chartType === 'bar' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="count" fill="#ff7c7c" name="Zero Result Count" />
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
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Zero-Result Count</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{item.keyword}</TableCell>
//                         <TableCell align="right">{item.count}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )} */}
//           </>
//         )}
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="success">No zero-result searches found. Great catalog coverage!</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default ZeroResultsSearches;





import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface ZeroResultSearchData {
  keyword: string;
  search_count: number;
  zero_result_count: number;
  [key: string]: any;
}

const COLORS = ['#ff7c7c', '#ffc658', '#82ca9d', '#8884d8', '#8dd1e1', '#d084d0'];

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const ZeroResultsSearches: React.FC = () => {
  const [data, setData] = useState<ZeroResultSearchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'table'>('bar');

  // default to last 28 days
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
        const url = `${API_PATHS.zeroResultsSearches}${params.toString() ? `?${params.toString()}` : ''}`;

        const result: any = await fetchFromAPI(url);

        // Normalize driver shapes (array | nested arrays | { rows } | { data })
        let rows: any[] = [];
        if (!result) rows = [];
        else if (Array.isArray(result)) {
          if (result.length > 0 && Array.isArray(result[0])) rows = result[0];
          else if (result.length > 1 && result[1] && result[1].rows) rows = result[1].rows;
          else rows = result;
        } else if (result.rows && Array.isArray(result.rows)) rows = result.rows;
        else if (Array.isArray(result.data)) rows = result.data;
        else rows = Array.isArray(result) ? result : [];

        const mapped: ZeroResultSearchData[] = (rows || [])
          .filter((r: any) => r && (r.keyword || r.search_keyword || r.term))
          .map((r: any) => {
            const kw = String(r.keyword ?? r.search_keyword ?? r.term ?? 'Unknown');
            const search_count = Number(r.search_count ?? r.search_count_total ?? r.total_searches ?? r.count_total ?? 0) || 0;
            const zero_result_count = Number(r.zero_result_count ?? r.zero_count ?? r.count ?? r.zero_results ?? 0) || 0;
            return {
              keyword: kw,
              search_count,
              zero_result_count
            };
          })
          .sort((a, b) => b.zero_result_count - a.zero_result_count)
          .slice(0, 50);

        setData(mapped);
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

  const handleChartTypeChange = (event: React.MouseEvent<HTMLElement>, newType: 'bar' | 'table') => {
    if (newType !== null) setChartType(newType);
  };

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5">Zero-Result Searches</Typography>
            <Typography variant="caption" color="textSecondary">Shows which keywords fail most often</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField label="Start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
            <TextField label="End" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
            <Button variant="outlined" onClick={onApply} size="small">Apply</Button>
            <Button variant="text" onClick={onReset} size="small">Reset</Button>

            <ToggleButtonGroup value={chartType} exclusive onChange={handleChartTypeChange} size="small" aria-label="chart type">
              <ToggleButton value="bar" aria-label="bar chart">Bar Chart</ToggleButton>
              <ToggleButton value="table" aria-label="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && (
          <>
            {chartType === 'bar' && (
              <Box sx={{ width: '100%', height: 420, mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 120 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="zero_result_count" fill="#ff7c7c" name="Zero-Result Count">
                      {data.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Keyword</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Count</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Zero Result Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{row.keyword}</TableCell>
                      <TableCell align="right">{row.search_count}</TableCell>
                      <TableCell align="right">{row.zero_result_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No zero-result searches found for the selected range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ZeroResultsSearches;