// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
// import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface TrendingKeywordData {
//   keyword: string;
//   wow_change: string;
//   current_volume?: number;
//   previous_volume?: number;
//   [key: string]: string | number | undefined;
// }

// export const TrendingKeywords: React.FC = () => {
//   const [data, setData] = useState<TrendingKeywordData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'bar' | 'table'>('bar');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.trendingKeywords);
        
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
//             wow_change: item.wow_change,
//             current_volume: item.current_volume,
//             previous_volume: item.previous_volume
//           }))
//           .slice(0, 15);
        
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

//   // Prepare data for chart (extract numeric value from percentage string)
//   const chartData = data.map(item => ({
//     keyword: item.keyword,
//     wow_change: parseFloat(item.wow_change as string),
//     wow_change_label: item.wow_change
//   }));

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <TrendingUpIcon sx={{ color: '#82ca9d' }} />
//             <Typography variant="h5">Trending Keywords (WoW Change)</Typography>
//           </Box>
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
//                   <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
//                     <YAxis label={{ value: 'WoW Change (%)', angle: -90, position: 'insideLeft' }} />
//                     <Tooltip 
//                       formatter={(value: any) => value.toFixed(2) + '%'}
//                       labelFormatter={(label) => `Keyword: ${label}`}
//                     />
//                     <Legend />
//                     <Bar dataKey="wow_change" fill="#82ca9d" name="WoW Change (%)" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
            
//           </>
//         )}
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="info">No trending keywords with positive growth this week</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default TrendingKeywords;





import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Button
} from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface TrendingKeywordData {
  keyword: string;
  current_week_volume: number;
  previous_week_volume: number;
  wow_change: number; // percent (e.g., 25.34)
  [key: string]: any;
}

const COLORS = ['#82ca9d', '#ffc658', '#ff7c7c', '#8884d8', '#8dd1e1', '#d084d0'];

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const TrendingKeywords: React.FC = () => {
  const [data, setData] = useState<TrendingKeywordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'bar' | 'table'>('bar');

  // default to last 7 days
  const today = new Date();
  const defaultEnd = formatDate(today);
  const defaultStart = formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));

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
        const url = `${API_PATHS.trendingKeywords}${params.toString() ? `?${params.toString()}` : ''}`;

        const res: any = await fetchFromAPI(url);

        // Normalize result shapes
        let rows: any[] = [];
        if (!res) rows = [];
        else if (Array.isArray(res)) {
          if (res.length > 0 && Array.isArray(res[0])) rows = res[0];
          else if (res.length > 1 && res[1] && res[1].rows) rows = res[1].rows;
          else rows = res;
        } else if (res.rows && Array.isArray(res.rows)) rows = res.rows;
        else if (Array.isArray(res.data)) rows = res.data;
        else rows = Array.isArray(res) ? res : [];

        const mapped: TrendingKeywordData[] = (rows || [])
          .filter(r => r && (r.keyword || r.keyword === ''))
          .map((r: any) => {
            const kw = String(r.keyword ?? r.search_keyword ?? '');
            const cur = Number(r.current_week_volume ?? r.current_volume ?? r.current_week ?? 0) || 0;
            const prev = Number(r.previous_week_volume ?? r.previous_volume ?? r.previous_week ?? 0) || 0;
            const wow = Number(r.wow_change ?? r.wow_change_pct ?? r.wow_change_percent ?? 0) || 0;
            return {
              keyword: kw,
              current_week_volume: cur,
              previous_week_volume: prev,
              wow_change: typeof wow === 'string' ? parseFloat(String(wow)) : wow
            };
          })
          .sort((a, b) => b.wow_change - a.wow_change)
          .slice(0, 50);

        setData(mapped);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch data');
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon sx={{ color: '#82ca9d' }} />
            <Typography variant="h5">Trending Keywords (WoW Change)</Typography>
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

            <ToggleButtonGroup value={view} exclusive onChange={(e, v) => v !== null && setView(v)} size="small">
              <ToggleButton value="bar">Bar (WoW %)</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && (
          <>
            {view === 'bar' && (
              <Box sx={{ width: '100%', height: 420, mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} interval={0} />
                    <YAxis label={{ value: 'WoW Change (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value: any) => `${value.toFixed ? value.toFixed(2) : value}%`} />
                    <Bar dataKey="wow_change" fill="#82ca9d" name="WoW Change (%)">
                      {data.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {/* Table: | keyword | current_week_volume | previous_week_volume | wow_change% | */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Keyword</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Current Week Volume</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Previous Week Volume</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>WoW Change%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{row.keyword}</TableCell>
                      <TableCell align="right">{row.current_week_volume}</TableCell>
                      <TableCell align="right">{row.previous_week_volume}</TableCell>
                      <TableCell align="right">{row.wow_change.toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No trending keywords found for the selected range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingKeywords;