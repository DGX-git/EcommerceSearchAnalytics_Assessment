// // import React, { useEffect, useState } from 'react';
// // import { BarChart, PieChart, Pie, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// // import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// // import { fetchFromAPI } from '../utils';
// // import { API_PATHS } from '../constants';

// // interface SearchByLocationData {
// //   region: string;
// //   search_count: number;
// //   unique_customers: number;
// //   avg_results: number;
// //   avg_rating: number;
// //   [key: string]: string | number;
// // }

// // const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

// // export const SearchByLocationOrRegion: React.FC = () => {
// //   const [data, setData] = useState<SearchByLocationData[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [chartType, setChartType] = useState<'bar' | 'pie' | 'table'>('bar');

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         const result: any = await fetchFromAPI(API_PATHS.searchByLocationOrRegion);
        
// //         // Handle both array and nested array responses
// //         let processedData = Array.isArray(result) ? result : [];
        
// //         // If result is an array with metadata object, extract the data array
// //         if (Array.isArray(result) && result.length > 0 && result[0] && Array.isArray(result[0])) {
// //           processedData = result[0];
// //         } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
// //           processedData = result[1].rows;
// //         }
        
// //         // Filter and process data
// //         const filteredData = processedData
// //           .filter((item: any) => item.region && item.region.trim() !== '')
// //           .map((item: any) => ({
// //             region: item.region,
// //             search_count: parseInt(item.search_count, 10),
// //             unique_customers: parseInt(item.unique_customers, 10),
// //             avg_results: parseFloat(item.avg_results),
// //             avg_rating: parseFloat(item.avg_rating)
// //           }))
// //           .sort((a: SearchByLocationData, b: SearchByLocationData) => b.search_count - a.search_count)
// //           .slice(0, 20);
        
// //         setData(filteredData);
// //       } catch (err) {
// //         setError(err instanceof Error ? err.message : 'Failed to fetch data');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchData();
// //   }, []);

// //   const handleChartTypeChange = (
// //     event: React.MouseEvent<HTMLElement>,
// //     newChartType: 'bar' | 'pie' | 'table',
// //   ) => {
// //     if (newChartType !== null) {
// //       setChartType(newChartType);
// //     }
// //   };

// //   const totalSearches = data.reduce((sum, item) => sum + item.search_count, 0);

// //   return (
// //     <Card sx={{ m: 2 }}>
// //       <CardContent>
// //         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
// //           <Typography variant="h5">Search by Location / Region</Typography>
// //           <ToggleButtonGroup
// //             value={chartType}
// //             exclusive
// //             onChange={handleChartTypeChange}
// //             aria-label="chart type"
// //           >
// //             <ToggleButton value="bar" aria-label="bar chart">
// //               Bar Chart
// //             </ToggleButton>
// //             <ToggleButton value="pie" aria-label="pie chart">
// //               Pie Chart
// //             </ToggleButton>
// //             <ToggleButton value="table" aria-label="table">
// //               Table
// //             </ToggleButton>
// //           </ToggleButtonGroup>
// //         </Box>
        
// //         {loading && <CircularProgress />}
// //         {error && <Alert severity="error">{error}</Alert>}
// //         {!loading && !error && data.length > 0 && (
// //           <>
// //             {chartType === 'bar' && (
// //               <Box sx={{ width: '100%', height: 400 }}>
// //                 <ResponsiveContainer width="100%" height="100%">
// //                   <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
// //                     <CartesianGrid strokeDasharray="3 3" />
// //                     <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
// //                     <YAxis />
// //                     <Tooltip />
// //                     <Legend />
// //                     <Bar dataKey="search_count" fill="#ffc658" name="Search Count" />
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               </Box>
// //             )}
// //             {chartType === 'pie' && (
// //               <Box sx={{ width: '100%', height: 400 }}>
// //                 <ResponsiveContainer width="100%" height="100%">
// //                   <PieChart>
// //                     <Pie
// //                       data={data}
// //                       dataKey="search_count"
// //                       nameKey="region"
// //                       cx="50%"
// //                       cy="50%"
// //                       outerRadius={120}
// //                       label
// //                     >
// //                       {data.map((entry, index) => (
// //                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// //                       ))}
// //                     </Pie>
// //                     <Tooltip />
// //                     <Legend />
// //                   </PieChart>
// //                 </ResponsiveContainer>
// //               </Box>
// //             )}
// //             {chartType === 'table' && (
// //               <TableContainer component={Paper}>
// //                 <Table>
// //                   <TableHead>
// //                     <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
// //                       <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
// //                       <TableCell sx={{ fontWeight: 'bold' }}>Region</TableCell>
// //                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Count</TableCell>
// //                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
// //                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unique Customers</TableCell>
// //                       <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avg Results</TableCell>
// //                       <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avg Rating</TableCell>
// //                     </TableRow>
// //                   </TableHead>
// //                   <TableBody>
// //                     {data.map((item, index) => (
// //                       <TableRow key={index} hover>
// //                         <TableCell>{index + 1}</TableCell>
// //                         <TableCell>{item.region}</TableCell>
// //                         <TableCell align="right">{item.search_count}</TableCell>
// //                         <TableCell align="right">
// //                           {totalSearches > 0 
// //                             ? ((item.search_count / totalSearches) * 100).toFixed(2) + '%'
// //                             : '0%'
// //                           }
// //                         </TableCell>
// //                         <TableCell align="right">{item.unique_customers}</TableCell>
// //                         <TableCell align="center">{item.avg_results.toFixed(1)}</TableCell>
// //                         <TableCell align="center">
// //                           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
// //                             {'★'.repeat(Math.round(item.avg_rating))}
// //                             <span>({item.avg_rating.toFixed(1)})</span>
// //                           </Box>
// //                         </TableCell>
// //                       </TableRow>
// //                     ))}
// //                   </TableBody>
// //                 </Table>
// //               </TableContainer>
// //             )}
// //           </>
// //         )}
// //         {!loading && !error && data.length === 0 && (
// //           <Alert severity="info">No search by location/region data available</Alert>
// //         )}
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default SearchByLocationOrRegion;



// import React, { useEffect, useState } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell
// } from 'recharts';
// import {
//   Box,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   Typography,
//   ToggleButton,
//   ToggleButtonGroup,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   TextField,
//   Button
// } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface SearchByLocationData {
//   region: string;
//   search_volume: number;
//   unique_customers?: number;
//   avg_results?: number;
//   avg_rating?: number;
//   [key: string]: any;
// }

// const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

// function formatDate(d: Date) {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, '0');
//   const dd = String(d.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// const SearchByLocationOrRegion: React.FC = () => {
//   const [data, setData] = useState<SearchByLocationData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'bar' | 'pie' | 'table'>('bar');

//   // date filter states - default to last 28 days
//   const today = new Date();
//   const defaultEnd = formatDate(today);
//   const defaultStart = formatDate(new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000));

//   const [startDate, setStartDate] = useState<string>(defaultStart);
//   const [endDate, setEndDate] = useState<string>(defaultEnd);
//   const [appliedStart, setAppliedStart] = useState<string>(defaultStart);
//   const [appliedEnd, setAppliedEnd] = useState<string>(defaultEnd);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const params = new URLSearchParams();
//         if (appliedStart) params.append('startDate', appliedStart);
//         if (appliedEnd) params.append('endDate', appliedEnd);
//         const url = `${API_PATHS.searchByLocationOrRegion}${params.toString() ? `?${params.toString()}` : ''}`;

//         const result: any = await fetchFromAPI(url);

//         // Normalize response shapes:
//         // - array of rows
//         // - nested driver arrays: [rows, metadata] or [[...rows], ...]
//         // - object with `rows`
//         let processed: any[] = [];
//         if (!result) {
//           processed = [];
//         } else if (Array.isArray(result)) {
//           if (result.length > 0 && Array.isArray(result[0])) {
//             processed = result[0];
//           } else if (result.length > 1 && result[1] && result[1].rows) {
//             processed = result[1].rows;
//           } else {
//             processed = result;
//           }
//         } else if (result.rows && Array.isArray(result.rows)) {
//           processed = result.rows;
//         } else {
//           // could be object keyed values -> try to coerce
//           processed = Array.isArray(result.data) ? result.data : [];
//         }

//         // Map to required minimal shape: { region, search_volume }
//         const mapped: SearchByLocationData[] = (processed || [])
//           .filter((r: any) => r && (r.region || r.region === 'Unknown'))
//           .map((r: any) => {
//             const region = r.region ?? r.region_name ?? r.name ?? 'Unknown';
//             // Backend uses search_count naming in many services — normalise to search_volume
//             const searchCount = Number(r.search_count ?? r.search_volume ?? r.search_count_total ?? r.search_count_total ?? 0);
//             return {
//               region: String(region),
//               search_volume: Number.isFinite(searchCount) ? Math.max(0, Math.floor(searchCount)) : 0,
//               unique_customers: Number(r.unique_customers ?? r.unique_customers_count ?? 0),
//               avg_results: Number(r.avg_results ?? 0),
//               avg_rating: Number(r.avg_rating ?? 0)
//             };
//           })
//           .sort((a: SearchByLocationData, b: SearchByLocationData) => b.search_volume - a.search_volume)
//           .slice(0, 50);

//         setData(mapped);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch data');
//         setData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [appliedStart, appliedEnd]);

//   const handleChartTypeChange = (
//     event: React.MouseEvent<HTMLElement>,
//     newChartType: 'bar' | 'pie' | 'table'
//   ) => {
//     if (newChartType !== null) setChartType(newChartType);
//   };

//   const onApply = () => {
//     setAppliedStart(startDate);
//     setAppliedEnd(endDate);
//   };

//   const onReset = () => {
//     setStartDate(defaultStart);
//     setEndDate(defaultEnd);
//     setAppliedStart(defaultStart);
//     setAppliedEnd(defaultEnd);
//   };

//   const totalSearches = data.reduce((s, r) => s + (r.search_volume || 0), 0);

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Box>
//             <Typography variant="h5">Search by Location / Region</Typography>
//             <Typography variant="caption" color="textSecondary">
//               Visualizing demand by region
//             </Typography>
//           </Box>

//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <TextField
//               label="Start"
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//               size="small"
//             />
//             <TextField
//               label="End"
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//               size="small"
//             />
//             <Button variant="outlined" onClick={onApply} size="small">Apply</Button>
//             <Button variant="text" onClick={onReset} size="small">Reset</Button>

//             <ToggleButtonGroup
//               value={chartType}
//               exclusive
//               onChange={handleChartTypeChange}
//               aria-label="chart type"
//               size="small"
//             >
//               <ToggleButton value="bar" aria-label="bar chart">Bar</ToggleButton>
//               <ToggleButton value="pie" aria-label="pie chart">Pie</ToggleButton>
//               <ToggleButton value="table" aria-label="table">Table</ToggleButton>
//             </ToggleButtonGroup>
//           </Box>
//         </Box>

//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}

//         {!loading && !error && data.length > 0 && (
//           <>
//             {chartType === 'bar' && (
//               <Box sx={{ width: '100%', height: 420, mb: 2 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="search_volume" fill="#ffc658" name="Search Volume" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}

//             {chartType === 'pie' && (
//               <Box sx={{ width: '100%', height: 420, mb: 2 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={data}
//                       dataKey="search_volume"
//                       nameKey="region"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={140}
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

//             {/* Table that matches requested schema: | region | search_volume | */}
//             {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table size="small">
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Region</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Volume</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((row, idx) => (
//                       <TableRow key={idx} hover>
//                         <TableCell>{row.region}</TableCell>
//                         <TableCell align="right">{row.search_volume}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}

//             {/* Small default table view shown when not explicitly on "table" */}
//             {chartType !== 'table' && (
//               <Box sx={{ mt: 1 }}>
//                 <TableContainer component={Paper}>
//                   <Table size="small">
//                     <TableHead>
//                       <TableRow sx={{ backgroundColor: '#fafafa' }}>
//                         <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
//                         <TableCell sx={{ fontWeight: 'bold' }}>Region</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Volume</TableCell>
//                         <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {data.map((row, idx) => (
//                         <TableRow key={idx} hover>
//                           <TableCell>{idx + 1}</TableCell>
//                           <TableCell>{row.region}</TableCell>
//                           <TableCell align="right">{row.search_volume}</TableCell>
//                           <TableCell align="right">
//                             {totalSearches > 0 ? ((row.search_volume / totalSearches) * 100).toFixed(2) + '%' : '0%'}
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </Box>
//             )}
//           </>
//         )}

//         {!loading && !error && data.length === 0 && (
//           <Alert severity="info">No search by location/region data available for the selected range</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default SearchByLocationOrRegion;




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
  ToggleButtonGroup,
} from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface SearchByLocationData {
  region: string;
  search_volume: number;
  [key: string]: any;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const SearchByLocationOrRegion: React.FC = () => {
  const [data, setData] = useState<SearchByLocationData[]>([]);
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
        const url = `${API_PATHS.searchByLocationOrRegion}${params.toString() ? `?${params.toString()}` : ''}`;

        const result: any = await fetchFromAPI(url);

        // Normalize response shapes
        let processed: any[] = [];
        if (!result) {
          processed = [];
        } else if (Array.isArray(result)) {
          if (result.length > 0 && Array.isArray(result[0])) {
            processed = result[0];
          } else if (result.length > 1 && result[1] && result[1].rows) {
            processed = result[1].rows;
          } else {
            processed = result;
          }
        } else if (result.rows && Array.isArray(result.rows)) {
          processed = result.rows;
        } else if (Array.isArray(result.data)) {
          processed = result.data;
        } else {
          processed = Array.isArray(result) ? result : [];
        }

        // Map to required minimal shape: { region, search_volume }
        const mapped: SearchByLocationData[] = (processed || [])
          .filter((r: any) => r && (r.region || r.region === 'Unknown'))
          .map((r: any) => {
            const region = r.region ?? r.region_name ?? r.name ?? 'Unknown';
            const searchCount = Number(r.search_count ?? r.search_volume ?? r.search_count_total ?? 0) || 0;
            return {
              region: String(region),
              search_volume: Math.max(0, Math.floor(searchCount)),
            };
          })
          .sort((a: SearchByLocationData, b: SearchByLocationData) => b.search_volume - a.search_volume)
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

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: 'bar' | 'table'
  ) => {
    if (newChartType !== null) setChartType(newChartType);
  };

  const totalSearches = data.reduce((s, r) => s + (r.search_volume || 0), 0);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5">Search by Location / Region</Typography>
            <Typography variant="caption" color="textSecondary">Visualizing demand by region</Typography>
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
              value={chartType}
              exclusive
              onChange={handleChartTypeChange}
              aria-label="chart type"
              size="small"
            >
              <ToggleButton value="bar" aria-label="bar chart">Bar</ToggleButton>
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
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" angle={-45} textAnchor="end" interval={0} height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="search_volume" fill="#8884d8" name="Search Volume">
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {/* Table with only the requested columns: | region | search_volume | */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Region</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Volume</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>{item.region}</TableCell>
                      <TableCell align="right">{item.search_volume}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* small summary below */}
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Typography variant="caption">Total searches: {totalSearches}</Typography>
            </Box>
          </>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No search by location/region data available for the selected range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchByLocationOrRegion;