// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface CategoryDemandData {
//   category: string;
//   demand: number;
//   [key: string]: string | number;
// }

// export const CategoryDemand: React.FC = () => {
//   const [data, setData] = useState<CategoryDemandData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'bar' | 'line' | 'table'>('bar');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.categoryDemand);
        
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
//           .filter((item: any) => item.category && item.category.trim() !== '')
//           .map((item: any) => ({
//             category: item.category,
//             demand: parseInt(item.demand, 10)
//           }))
//           .sort((a: CategoryDemandData, b: CategoryDemandData) => b.demand - a.demand)
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
//     newChartType: 'bar' | 'line' | 'table',
//   ) => {
//     if (newChartType !== null) {
//       setChartType(newChartType);
//     }
//   };

//   // Calculate total demand for percentage display
//   const totalDemand = data.reduce((sum, item) => sum + item.demand, 0);

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Category Demand</Typography>
//           <ToggleButtonGroup
//             value={chartType}
//             exclusive
//             onChange={handleChartTypeChange}
//             aria-label="chart type"
//           >
//             <ToggleButton value="bar" aria-label="bar chart">
//               Bar Chart
//             </ToggleButton>
//             <ToggleButton value="line" aria-label="line chart">
//               Line Chart
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
//                     <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="demand" fill="#82ca9d" name="Demand" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === 'line' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Line type="monotone" dataKey="demand" stroke="#82ca9d" strokeWidth={2} dot={{ fill: '#82ca9d' }} name="Demand" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Demand</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{item.category}</TableCell>
//                         <TableCell align="right">{item.demand}</TableCell>
//                         <TableCell align="right">
//                           {totalDemand > 0 
//                             ? ((item.demand / totalDemand) * 100).toFixed(2) + '%'
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
//           <Alert severity="info">No category demand data available</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default CategoryDemand;







// import React, { useEffect, useState } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
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
//   Button,
// } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface CategoryDemandData {
//   category: string;
//   demand: number;
//   [key: string]: string | number;
// }

// function formatDate(d: Date) {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, '0');
//   const dd = String(d.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// export const CategoryDemand: React.FC = () => {
//   const [data, setData] = useState<CategoryDemandData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'bar' | 'table'>('bar');

//   // date filter states (controlled inputs)
//   const today = new Date();
//   const defaultEnd = formatDate(today);
//   const defaultStart = formatDate(new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000)); // last 28 days

//   const [startDate, setStartDate] = useState<string>(defaultStart);
//   const [endDate, setEndDate] = useState<string>(defaultEnd);

//   // applied filters used for fetching (so user can change inputs before applying)
//   const [appliedStart, setAppliedStart] = useState<string>(defaultStart);
//   const [appliedEnd, setAppliedEnd] = useState<string>(defaultEnd);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // Build query params
//         const params = new URLSearchParams();
//         if (appliedStart) params.append('startDate', appliedStart);
//         if (appliedEnd) params.append('endDate', appliedEnd);
//         const url = `${API_PATHS.categoryDemand}${params.toString() ? `?${params.toString()}` : ''}`;

//         const result: any = await fetchFromAPI(url);

//         // Normalize result shapes (handle nested array metadata shapes)
//         let processedData = Array.isArray(result) ? result : [];

//         if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
//           processedData = result[0];
//         } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
//           processedData = result[1].rows;
//         }

//         const filteredData = processedData
//           .filter((item: any) => item.category && String(item.category).trim() !== '')
//           .map((item: any) => ({
//             category: String(item.category),
//             demand: typeof item.demand === 'number' ? item.demand : parseInt(item.demand, 10) || 0,
//           }))
//           .sort((a: CategoryDemandData, b: CategoryDemandData) => b.demand - a.demand)
//           .slice(0, 20);

//         setData(filteredData);
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
//     newChartType: 'bar' | 'table' | null,
//   ) => {
//     if (newChartType !== null) {
//       setChartType(newChartType);
//     }
//   };

//   const totalDemand = data.reduce((sum, item) => sum + item.demand, 0);

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

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Category Demand</Typography>

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
//               aria-label="view type"
//               size="small"
//             >
//               <ToggleButton value="bar" aria-label="bar chart">
//                 Bar Chart
//               </ToggleButton>
//               <ToggleButton value="table" aria-label="table">
//                 Table
//               </ToggleButton>
//             </ToggleButtonGroup>
//           </Box>
//         </Box>

//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}

//         {!loading && !error && data.length > 0 && (
//           <>
//             {chartType === 'bar' && (
//               <Box sx={{ width: '100%', height: 500 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     layout="vertical"
//                     data={data}
//                     margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" />
//                     <YAxis type="category" dataKey="category" width={220} />
//                     <Tooltip formatter={(value: any) => [value, 'Search Volume']} />
//                     <Bar dataKey="demand" fill="#1976d2" name="Search Volume" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}

//             {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Volume</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Share%</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover>
//                         <TableCell>{item.category}</TableCell>
//                         <TableCell align="right">{item.demand}</TableCell>
//                         <TableCell align="right">
//                           {totalDemand > 0 ? ((item.demand / totalDemand) * 100).toFixed(2) + '%' : '0.00%'}
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
//           <Alert severity="info">No category demand data available for the selected range</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default CategoryDemand;



// frontend/src/components/CategoryDemand.tsx
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface CategoryDemandData {
  category: string;
  search_volume: number;
  [key: string]: string | number;
}

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const CategoryDemand: React.FC = () => {
  const [data, setData] = useState<CategoryDemandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'table'>('bar');

  // date filter states (controlled inputs)
  const today = new Date();
  const defaultEnd = formatDate(today);
  const defaultStart = formatDate(new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000)); // last 28 days

  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);

  // applied filters used for fetching (so user can change inputs before applying)
  const [appliedStart, setAppliedStart] = useState<string>(defaultStart);
  const [appliedEnd, setAppliedEnd] = useState<string>(defaultEnd);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build query params
        const params = new URLSearchParams();
        if (appliedStart) params.append('startDate', appliedStart);
        if (appliedEnd) params.append('endDate', appliedEnd);
        const url = `${API_PATHS.categoryDemand}${params.toString() ? `?${params.toString()}` : ''}`;

        const result: any = await fetchFromAPI(url);

        // Normalize result shapes (handle nested array metadata shapes)
        let processedData = Array.isArray(result) ? result : [];

        if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
          processedData = result[0];
        } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
          processedData = result[1].rows;
        }

        const filteredData = processedData
          .filter((item: any) => item.category && String(item.category).trim() !== '')
          .map((item: any) => ({
            category: String(item.category),
            search_volume: typeof item.demand === 'number' ? item.demand : (typeof item.search_volume === 'number' ? item.search_volume : parseInt(item.demand ?? item.search_volume ?? 0, 10) || 0),
          }))
          .sort((a: CategoryDemandData, b: CategoryDemandData) => b.search_volume - a.search_volume)
          .slice(0, 20);

        setData(filteredData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appliedStart, appliedEnd]);

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: 'bar' | 'table' | null,
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const totalDemand = data.reduce((sum, item) => sum + item.search_volume, 0);

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
          <Typography variant="h5">Category Demand</Typography>

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
              aria-label="view type"
              size="small"
            >
              <ToggleButton value="bar" aria-label="bar chart">
                Bar Chart
              </ToggleButton>
              <ToggleButton value="table" aria-label="table">
                Table
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && (
          <>
            {chartType === 'bar' && (
              <Box sx={{ width: '100%', height: 500 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="category" width={220} />
                    <Tooltip formatter={(value: any) => [value, 'Search Volume']} />
                    <Bar dataKey="search_volume" fill="#1976d2" name="Search Volume" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {chartType === 'table' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>category</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>search_volume</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>share%</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{item.category}</TableCell>
                        <TableCell align="right">{item.search_volume}</TableCell>
                        <TableCell align="right">
                          {totalDemand > 0 ? ((item.search_volume / totalDemand) * 100).toFixed(2) + '%' : '0.00%'}
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
          <Alert severity="info">No category demand data available for the selected range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryDemand;