// import React, { useEffect, useState } from 'react';
// import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface BrandSearchVolumeData {
//   brand: string;
//   search_volume: number;
//   [key: string]: string | number;
// }

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#0088FE', '#82D982'];

// export const BrandSearchVolume: React.FC = () => {
//   const [data, setData] = useState<BrandSearchVolumeData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'pie' | 'bar' | 'table'>('pie');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.brandSearchVolume);
        
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
//           .filter((item: any) => item.brand && item.brand.trim() !== '')
//           .map((item: any) => ({
//             brand: item.brand,
//             search_volume: parseInt(item.search_volume, 10)
//           }))
//           .sort((a: BrandSearchVolumeData, b: BrandSearchVolumeData) => b.search_volume - a.search_volume)
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
//     newChartType: 'pie' | 'bar' | 'table',
//   ) => {
//     if (newChartType !== null) {
//       setChartType(newChartType);
//     }
//   };

//   // Calculate total for percentage display
//   const totalSearchVolume = data.reduce((sum, item) => sum + item.search_volume, 0);

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Brand Search Volume</Typography>
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
//             {/* {chartType === 'pie' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie 
//                       data={data} 
//                       dataKey="search_volume" 
//                       nameKey="brand" 
//                       cx="50%" 
//                       cy="50%" 
//                       outerRadius={120}
//                       label={({ brand, value }) => `${brand}: ${value}`}
//                     >
//                       {data.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip formatter={(value) => value.toString()} />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </Box>
//             )} */}
//             {chartType === 'pie' && (
//   <Box sx={{ width: '100%', height: 400 }}>
//     <ResponsiveContainer width="100%" height="100%">
//       <PieChart>
//         <Pie 
//           data={data} 
//           dataKey="search_volume" 
//           nameKey="brand" 
//           cx="50%" 
//           cy="50%" 
//           outerRadius={120}
//           label={({ name, value }) => `${name}: ${value}`}
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip formatter={(value) => value.toString()} />
//         <Legend />
//       </PieChart>
//     </ResponsiveContainer>
//   </Box>
// )}
//             {chartType === 'bar' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="brand" angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="search_volume" fill="#0088FE" name="Search Volume" />
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
//                       <TableCell sx={{ fontWeight: 'bold' }}>Brand</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Volume</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{item.brand}</TableCell>
//                         <TableCell align="right">{item.search_volume}</TableCell>
//                         <TableCell align="right">
//                           {totalSearchVolume > 0 
//                             ? ((item.search_volume / totalSearchVolume) * 100).toFixed(2) + '%'
//                             : '0%'
//                           }
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )} */}
//           </>
//         )}
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="info">No brand search volume data available</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default BrandSearchVolume;



import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
  Box, CircularProgress, Alert, Card, CardContent, Typography,
  ToggleButton, ToggleButtonGroup, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper,
  TextField, Button, Stack
} from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface BrandSearchVolumeData {
  brand: string;
  search_volume: number;
  [key: string]: string | number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8A2BE2', '#FF69B4'];

const DEFAULT_WEEKS = 4;

export const BrandSearchVolume: React.FC = () => {
  const [data, setData] = useState<BrandSearchVolumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'table'>('pie');

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filterError, setFilterError] = useState<string | null>(null);

  // defaults: last DEFAULT_WEEKS
  useEffect(() => {
    const today = new Date();
    const past = new Date(today.getTime() - DEFAULT_WEEKS * 7 * 24 * 60 * 60 * 1000);
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(past.toISOString().split('T')[0]);
  }, []);

  const fetchData = async (start?: string, end?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (start || startDate) params.append('startDate', (start || startDate) as string);
      if (end || endDate) params.append('endDate', (end || endDate) as string);

      const endpoint = params.toString() ? `${API_PATHS.brandSearchVolume}?${params.toString()}` : API_PATHS.brandSearchVolume;
      const result: any = await fetchFromAPI(endpoint);

      let processedData = Array.isArray(result) ? result : [];
      // Some endpoints return nested arrays; handle gracefully
      if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
        processedData = result[0];
      } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
        processedData = result[1].rows;
      }

      const filteredData = processedData
        .filter((item: any) => item.brand && String(item.brand).trim() !== '')
        .map((item: any) => ({
          brand: item.brand,
          search_volume: Number(item.search_volume)
        }))
        .sort((a: BrandSearchVolumeData, b: BrandSearchVolumeData) => b.search_volume - a.search_volume)
        .slice(0, 20);

      setData(filteredData);
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
    setFilterError(null);
    if (!startDate || !endDate) {
      setFilterError('Please select both start and end dates');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setFilterError('Start date must be before end date');
      return;
    }
    fetchData();
  };

  const handleReset = () => {
    const today = new Date();
    const past = new Date(today.getTime() - DEFAULT_WEEKS * 7 * 24 * 60 * 60 * 1000);
    const newEnd = today.toISOString().split('T')[0];
    const newStart = past.toISOString().split('T')[0];
    setStartDate(newStart);
    setEndDate(newEnd);
    setFilterError(null);
    fetchData(newStart, newEnd);
  };

  const totalSearchVolume = data.reduce((sum, d) => sum + d.search_volume, 0);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Brand Search Volume</Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(e, v) => v && setChartType(v)}
          >
            <ToggleButton value="pie">Donut</ToggleButton>
            <ToggleButton value="bar">Bar</ToggleButton>
            <ToggleButton value="table">Table</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Date Range Filter */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Filter by Date Range</Typography>
          <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ flexWrap: 'wrap' }}>
            <TextField label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
            <TextField label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
            <Button variant="contained" onClick={handleApplyFilter}>Apply Filter</Button>
            <Button variant="outlined" onClick={handleReset}>Reset (Last {DEFAULT_WEEKS} Weeks)</Button>
          </Stack>
          {filterError && <Typography variant="caption" color="error">{filterError}</Typography>}
          {startDate && endDate && !filterError && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#666' }}>
              Showing data from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
            </Typography>
          )}
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && (
          <>
            {chartType === 'pie' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="search_volume"
                      nameKey="brand"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={120}
                      // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value.toString()} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}

            {chartType === 'bar' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="brand" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="search_volume" fill="#0088FE" name="Search Volume" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {chartType === 'table' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><strong>Brand</strong></TableCell>
                      <TableCell align="right"><strong>Search Volume</strong></TableCell>
                      <TableCell align="right"><strong>Share %</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{row.brand}</TableCell>
                        <TableCell align="right">{row.search_volume.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          {totalSearchVolume > 0 ? ((row.search_volume / totalSearchVolume) * 100).toFixed(2) + '%' : '0%'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No brand search volume data available for the selected date range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandSearchVolume;