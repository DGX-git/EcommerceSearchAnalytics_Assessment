// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface SeasonalityTrendsData {
//   season: string;
//   month: string;
//   search_volume: number;
//   unique_customers: number;
//   avg_results: number;
//   avg_rating: number;
//   [key: string]: string | number;
// }

// const SEASON_COLORS = {
//   'Winter': '#3498db',
//   'Spring': '#2ecc71',
//   'Summer': '#f39c12',
//   'Fall': '#e74c3c'
// };

// export const SeasonalityTrends: React.FC = () => {
//   const [data, setData] = useState<SeasonalityTrendsData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'line' | 'bar' | 'table'>('line');
//   const [selectedSeason, setSelectedSeason] = useState<string>('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.seasonalityTrends);
        
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
//           .filter((item: any) => item.month && item.season)
//           .map((item: any) => ({
//             season: item.season,
//             month: item.month,
//             search_volume: parseInt(item.search_volume, 10),
//             unique_customers: parseInt(item.unique_customers, 10),
//             avg_results: parseFloat(item.avg_results),
//             avg_rating: parseFloat(item.avg_rating)
//           }))
//           .sort((a: SeasonalityTrendsData, b: SeasonalityTrendsData) => a.month.localeCompare(b.month));
        
//         setData(filteredData);
//         if (filteredData.length > 0) {
//           setSelectedSeason(filteredData[0].season);
//         }
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

//   const seasonStats = data.reduce((acc, item) => {
//     if (!acc[item.season]) {
//       acc[item.season] = { total: 0, count: 0, avgVolume: 0 };
//     }
//     acc[item.season].total += item.search_volume;
//     acc[item.season].count += 1;
//     return acc;
//   }, {} as Record<string, any>);

//   Object.keys(seasonStats).forEach(season => {
//     seasonStats[season].avgVolume = (seasonStats[season].total / seasonStats[season].count).toFixed(2);
//   });

//   const maxVolume = Math.max(...data.map(d => d.search_volume));

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Seasonality Trends</Typography>
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

//         {/* Season Statistics */}
//         <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
//           {Object.entries(seasonStats).map(([season, stats]: [string, any]) => (
//             <Box
//               key={season}
//               sx={{
//                 p: 1.5,
//                 border: `2px solid ${SEASON_COLORS[season as keyof typeof SEASON_COLORS] || '#999'}`,
//                 borderRadius: 1,
//                 minWidth: 150
//               }}
//             >
//               <Typography variant="subtitle2" sx={{ color: SEASON_COLORS[season as keyof typeof SEASON_COLORS] || '#999', fontWeight: 'bold' }}>
//                 {season}
//               </Typography>
//               <Typography variant="caption">
//                 Avg Volume: {stats.avgVolume}
//               </Typography>
//             </Box>
//           ))}
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
//                     <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip 
//                       content={({ active, payload }) => {
//                         if (active && payload && payload.length) {
//                           const data = payload[0].payload as SeasonalityTrendsData;
//                           return (
//                             <Box sx={{ bg: 'white', p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
//                               <Typography variant="caption">{data.month}</Typography>
//                               <Typography variant="caption" display="block">{data.season}</Typography>
//                               <Typography variant="caption" display="block">Volume: {data.search_volume}</Typography>
//                             </Box>
//                           );
//                         }
//                         return null;
//                       }}
//                     />
//                     <Legend />
//                     <Line type="monotone" dataKey="search_volume" stroke="#0088FE" strokeWidth={2} dot={{ fill: '#0088FE' }} name="Search Volume" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === 'bar' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar 
//                       dataKey="search_volume" 
//                       name="Search Volume"
//                       shape={<Bar />}
//                     >
//                       {data.map((entry, index) => (
//                         <Bar
//                           key={`bar-${index}`}
//                           dataKey="search_volume"
//                           fill={SEASON_COLORS[entry.season as keyof typeof SEASON_COLORS] || '#999'}
//                         />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Month</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Season</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Volume</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Max</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unique Customers</TableCell>
//                       <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avg Rating</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover>
//                         <TableCell>{item.month}</TableCell>
//                         <TableCell>
//                           <Chip
//                             label={item.season}
//                             size="small"
//                             sx={{
//                               backgroundColor: SEASON_COLORS[item.season as keyof typeof SEASON_COLORS] || '#999',
//                               color: 'white'
//                             }}
//                           />
//                         </TableCell>
//                         <TableCell align="right">{item.search_volume}</TableCell>
//                         <TableCell align="right">
//                           {maxVolume > 0 
//                             ? ((item.search_volume / maxVolume) * 100).toFixed(1) + '%'
//                             : '0%'
//                           }
//                         </TableCell>
//                         <TableCell align="right">{item.unique_customers}</TableCell>
//                         <TableCell align="center">
//                           {'★'.repeat(Math.round(item.avg_rating))}
//                           <Typography variant="caption"> ({item.avg_rating.toFixed(1)})</Typography>
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
//           <Alert severity="info">No seasonality trends data available</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default SeasonalityTrends;




import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface SeasonalityRow {
  month: string; // 'YYYY-MM'
  search_volume: number;
  yoy_change: number; // percent numeric
  [k: string]: any;
}

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const SeasonalityTrends: React.FC = () => {
  const [data, setData] = useState<SeasonalityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'table'>('line');

  // Default window: last 12 months
  const today = new Date();
  const defaultEnd = formatDate(today);
  const defaultStart = formatDate(new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)); // start of month 11 months ago

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
        const url = `${API_PATHS.seasonalityTrends}${params.toString() ? `?${params.toString()}` : ''}`;
        const res: any = await fetchFromAPI(url);

        let rows: any[] = [];
        if (!res) rows = [];
        else if (Array.isArray(res)) {
          if (res.length > 0 && Array.isArray(res[0])) rows = res[0];
          else if (res.length > 1 && res[1] && res[1].rows) rows = res[1].rows;
          else rows = res;
        } else if (res.rows && Array.isArray(res.rows)) rows = res.rows;
        else if (Array.isArray(res.data)) rows = res.data;
        else rows = Array.isArray(res) ? res : [];

        const mapped: SeasonalityRow[] = (rows || [])
          .filter(r => r && (r.month || r.month === ''))
          .map((r: any) => ({
            month: String(r.month),
            search_volume: Number(r.search_volume ?? r.search_volume_total ?? 0) || 0,
            yoy_change: Number(r.yoy_change ?? r.yoy_change_pct ?? 0) || 0
          }))
          .sort((a, b) => a.month.localeCompare(b.month));

        setData(mapped);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch seasonality data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
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
          <Box>
            <Typography variant="h5">Seasonality Trends</Typography>
            <Typography variant="caption" color="textSecondary">Search volume over months with YoY change</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField label="Start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
            <TextField label="End" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
            <Button variant="outlined" onClick={onApply} size="small">Apply</Button>
            <Button variant="text" onClick={onReset} size="small">Reset</Button>

            <ToggleButtonGroup value={chartType} exclusive onChange={(e, v) => v !== null && setChartType(v)} size="small">
              <ToggleButton value="line">Line Chart</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && (
          <>
            {chartType === 'line' && (
              <Box sx={{ width: '100%', height: 420, mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value: any) => typeof value === 'number' ? value.toLocaleString() : value} />
                    <Line type="monotone" dataKey="search_volume" stroke="#0088FE" strokeWidth={2} dot={{ r: 3 }} name="Search Volume" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}

            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Month</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Volume</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>YoY Change%</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{row.month}</TableCell>
                      <TableCell align="right">{row.search_volume.toLocaleString()}</TableCell>
                      <TableCell align="right">{(row.yoy_change ?? 0).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No seasonality data available for the selected range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SeasonalityTrends;