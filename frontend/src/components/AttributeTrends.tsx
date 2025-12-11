// import React, { useEffect, useState } from 'react';
// import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { API_PATHS } from '../constants';
// import { fetchFromAPI } from '../utils';

// interface AttributeTrendsData {
//   attribute: string;
//   trend_value: number;
//   [key: string]: string | number;
// }

// export const AttributeTrends: React.FC = () => {
//   const [data, setData] = useState<AttributeTrendsData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'area' | 'bar' | 'table'>('bar');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.attributeTrends);
        
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
//           .filter((item: any) => item.attribute && item.attribute.trim() !== '')
//           .map((item: any) => ({
//             attribute: item.attribute,
//             trend_value: parseInt(item.trend_value, 10)
//           }))
//           .sort((a: AttributeTrendsData, b: AttributeTrendsData) => b.trend_value - a.trend_value)
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

//   // Calculate total for percentage display
//   const totalTrends = data.reduce((sum, item) => sum + item.trend_value, 0);

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Attribute Trends (vegan/SPF/acne-safe...)</Typography>
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
//                     <XAxis dataKey="attribute" angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Area type="monotone" dataKey="trend_value" fill="#8884d8" stroke="#8884d8" name="Search Interest" />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === 'bar' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="attribute" angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="trend_value" fill="#8884d8" name="Search Interest" />
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
//                       <TableCell sx={{ fontWeight: 'bold' }}>Attribute</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Interest</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>
//                           <Chip label={item.attribute} variant="outlined" size="small" />
//                         </TableCell>
//                         <TableCell align="right">{item.trend_value}</TableCell>
//                         <TableCell align="right">
//                           {totalTrends > 0 
//                             ? ((item.trend_value / totalTrends) * 100).toFixed(2) + '%'
//                             : '0%'
//                           }
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
//           <Alert severity="info">No attribute trend data available</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default AttributeTrends;




// frontend/src/components/AttributeTrends.tsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Stack } from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface AttributeTrendData {
  attribute: string;
  week: string; // ISO date (YYYY-MM-DD)
  search_volume: number;
}

interface ChartDataPoint {
  week: string;
  [key: string]: string | number;
}

const ATTRIBUTE_COLORS: { [key: string]: string } = {
  'vegan': '#FF6B6B',
  'SPF': '#4ECDC4',
  'acne-safe': '#45B7D1',
  'cruelty-free': '#96CEB4',
  'organic': '#FFEAA7',
  'natural': '#DDA15E',
  'hypoallergenic': '#BC6C25',
  'fragrance-free': '#D4A5A5',
};

const defaultWeeks = 8;

const AttributeTrends: React.FC = () => {
  const [data, setData] = useState<AttributeTrendData[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'table'>('line');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filterError, setFilterError] = useState<string | null>(null);

  // Set default date range: last 8 weeks
  useEffect(() => {
    const today = new Date();
    const eightWeeksAgo = new Date(today.getTime() - defaultWeeks * 7 * 24 * 60 * 60 * 1000);
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(eightWeeksAgo.toISOString().split('T')[0]);
  }, []);

  const fetchData = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      setFilterError(null);

      const startToUse = start || startDate;
      const endToUse = end || endDate;
      const params = new URLSearchParams();
      if (startToUse) params.append('startDate', startToUse);
      if (endToUse) params.append('endDate', endToUse);

      const endpoint = params.toString() ? `${API_PATHS.attributeTrends}?${params.toString()}` : API_PATHS.attributeTrends;
      const result: any = await fetchFromAPI(endpoint);

      // result expected to be array of { attribute, week, search_volume }
      let rows = Array.isArray(result) ? result : [];
      // normalize week: some DB drivers return Date objects, strings, or ISO with time; ensure YYYY-MM-DD
      rows = rows
        .filter((r: any) => r.attribute && r.week && r.search_volume)
        .map((r: any) => ({
          attribute: r.attribute,
          week: (typeof r.week === 'string' ? r.week : r.week?.toISOString?.().split('T')[0]) || '',
          search_volume: Number(r.search_volume),
        }))
        .sort((a: AttributeTrendData, b: AttributeTrendData) => {
          // sort descending week then attribute
          return new Date(b.week).getTime() - new Date(a.week).getTime() || b.search_volume - a.search_volume;
        });

      setData(rows);

      // pivot to chart data: one object per week, keys are attributes
      const chartMap = new Map<string, ChartDataPoint>();
      rows.forEach((row: AttributeTrendData) => {
        if (!chartMap.has(row.week)) chartMap.set(row.week, { week: row.week });
        const p = chartMap.get(row.week)!;
        p[row.attribute] = row.search_volume;
      });

      const sortedChart = Array.from(chartMap.values()).sort(
        (a, b) => new Date(a.week).getTime() - new Date(b.week).getTime()
      );
      setChartData(sortedChart);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const handleApplyFilter = () => {
    if (!startDate || !endDate) {
      setFilterError('Please select both start and end dates');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setFilterError('Start date must be before end date');
      return;
    }
    setFilterError(null);
    fetchData();
  };

  const handleReset = () => {
    const today = new Date();
    const eightWeeksAgo = new Date(today.getTime() - defaultWeeks * 7 * 24 * 60 * 60 * 1000);
    const newEnd = today.toISOString().split('T')[0];
    const newStart = eightWeeksAgo.toISOString().split('T')[0];
    setStartDate(newStart);
    setEndDate(newEnd);
    setFilterError(null);
    fetchData(newStart, newEnd);
  };

  const uniqueAttributes = Array.from(new Set(data.map(d => d.attribute))).sort();

  // Table summary totals per attribute
  const attributeTotals = data.reduce((acc: Record<string, { attribute: string; total: number; weeks: Set<string> }>, item) => {
    if (!acc[item.attribute]) acc[item.attribute] = { attribute: item.attribute, total: 0, weeks: new Set() };
    acc[item.attribute].total += item.search_volume;
    acc[item.attribute].weeks.add(item.week);
    return acc;
  }, {});

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
          <Typography variant="h5">Attribute Trends (vegan / SPF / acne-safe)</Typography>
          <ToggleButtonGroup value={chartType} exclusive onChange={(_, v) => v && setChartType(v)}>
            <ToggleButton value="line">Multi-Line Chart</ToggleButton>
            <ToggleButton value="table">Table</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Date Filter */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Filter by Date Range</Typography>
          <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ flexWrap: 'wrap' }}>
            <TextField label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
            <TextField label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
            <Button variant="contained" onClick={handleApplyFilter}>Apply Filter</Button>
            <Button variant="outlined" onClick={handleReset}>Reset (Last 8 Weeks)</Button>
          </Stack>
          {startDate && endDate && !filterError && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#666' }}>
              Showing data from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
            </Typography>
          )}
          {filterError && <Typography variant="caption" color="error">{filterError}</Typography>}
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && chartType === 'line' && chartData.length > 0 && (
          <Box sx={{ width: '100%', height: 480 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tickFormatter={(d) => new Date(String(d)).toLocaleDateString()} />
                <YAxis />
                <Tooltip labelFormatter={(label) => `Week of ${new Date(String(label)).toLocaleDateString()}`} />
                <Legend />
                {uniqueAttributes.map(attr => (
                  <Line
                    key={attr}
                    type="monotone"
                    dataKey={attr}
                    stroke={ATTRIBUTE_COLORS[attr] || '#8884d8'}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                    name={attr}
                    isAnimationActive
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        {!loading && !error && chartType === 'table' && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Detailed Attribute Trends</Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Attribute</strong></TableCell>
                    <TableCell><strong>Week</strong></TableCell>
                    <TableCell align="right"><strong>Search Volume</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell>
                        <Chip label={row.attribute} size="small" sx={{ backgroundColor: ATTRIBUTE_COLORS[row.attribute] || '#ccc', color: '#fff', fontWeight: 'bold' }} />
                      </TableCell>
                      <TableCell>{new Date(row.week).toLocaleDateString()}</TableCell>
                      <TableCell align="right">{row.search_volume.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" sx={{ mb: 1 }}>Attribute Summary</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Attribute</strong></TableCell>
                    <TableCell align="right"><strong>Total Searches</strong></TableCell>
                    <TableCell align="right"><strong>Weeks Tracked</strong></TableCell>
                    <TableCell align="right"><strong>Avg / Week</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(attributeTotals).sort((a, b) => b.total - a.total).map((item, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>
                        <Chip label={item.attribute} size="small" sx={{ backgroundColor: ATTRIBUTE_COLORS[item.attribute] || '#ccc', color: '#fff', fontWeight: 'bold' }} />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>{item.total.toLocaleString()}</TableCell>
                      <TableCell align="right">{item.weeks.size}</TableCell>
                      <TableCell align="right">{Math.round(item.total / Math.max(1, item.weeks.size))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {!loading && !error && chartData.length === 0 && (
          <Alert severity="info">No attribute trend data available for the selected date range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AttributeTrends;