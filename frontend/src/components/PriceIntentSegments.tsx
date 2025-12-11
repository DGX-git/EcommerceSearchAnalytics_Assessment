// import { fetchFromAPI } from '../utils';
// import React, { useEffect, useState } from 'react';
// import { BarChart, PieChart, Pie, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import { API_PATHS } from '../constants';


// interface PriceIntentSegmentData {
//   price_segment: string;
//   segment_count: number;
//   avg_max_price: number;
//   min_price: number;
//   max_price: number;
//   [key: string]: string | number;
// }

// const COLORS = ['#4CAF50', '#2196F3', '#FF9800'];

// export const PriceIntentSegments: React.FC = () => {
//   const [data, setData] = useState<PriceIntentSegmentData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'bar' | 'pie' | 'table'>('bar');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.priceIntentSegments);
        
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
//           .filter((item: any) => item.price_segment && item.price_segment.trim() !== '')
//           .map((item: any) => ({
//             price_segment: item.price_segment,
//             segment_count: parseInt(item.segment_count, 10),
//             avg_max_price: parseFloat(item.avg_max_price),
//             min_price: parseInt(item.min_price, 10),
//             max_price: parseInt(item.max_price, 10)
//           }));
        
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
//     newChartType: 'bar' | 'pie' | 'table',
//   ) => {
//     if (newChartType !== null) {
//       setChartType(newChartType);
//     }
//   };

//   // Calculate total for percentage display
//   const totalSegments = data.reduce((sum, item) => sum + item.segment_count, 0);

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Price Intent Segments</Typography>
//           <ToggleButtonGroup
//             value={chartType}
//             exclusive
//             onChange={handleChartTypeChange}
//             aria-label="chart type"
//           >
//             <ToggleButton value="bar" aria-label="bar chart">
//               Bar Chart
//             </ToggleButton>
//             <ToggleButton value="pie" aria-label="pie chart">
//               Pie Chart
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
//                   <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="price_segment" angle={-45} textAnchor="end" height={100} />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="segment_count" fill="#2196F3" name="Search Count" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === 'pie' && (
//               <Box sx={{ width: '100%', height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={data}
//                       dataKey="segment_count"
//                       nameKey="price_segment"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={120}
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
//             {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                       <TableCell sx={{ fontWeight: 'bold' }}>Price Segment</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Count</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Avg Max Price</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price Range</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover>
//                         <TableCell>{item.price_segment}</TableCell>
//                         <TableCell align="right">{item.segment_count}</TableCell>
//                         <TableCell align="right">
//                           {totalSegments > 0 
//                             ? ((item.segment_count / totalSegments) * 100).toFixed(2) + '%'
//                             : '0%'
//                           }
//                         </TableCell>
//                         <TableCell align="right">${item.avg_max_price.toFixed(2)}</TableCell>
//                         <TableCell align="right">${item.min_price} - ${item.max_price}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </>
//         )}
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="info">No price intent segment data available</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default PriceIntentSegments;




// frontend/src/components/PriceIntentSegments.tsx
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
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
} from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface PriceIntentSegmentData {
  price_segment: string;
  keyword_count: number;
  search_volume: number;
  avg_max_price?: number;
  min_price?: number;
  max_price?: number;
  [key: string]: any;
}

const COLORS = ['#4CAF50', '#2196F3', '#FF9800'];

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const PriceIntentSegments: React.FC = () => {
  const [data, setData] = useState<PriceIntentSegmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'table'>('pie');

  // date filter states
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
        const url = `${API_PATHS.priceIntentSegments}${params.toString() ? `?${params.toString()}` : ''}`;

        const result: any = await fetchFromAPI(url);

        let processedData = Array.isArray(result) ? result : [];
        if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
          processedData = result[0];
        } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
          processedData = result[1].rows;
        }

        const filtered = (processedData || [])
          .filter((item: any) => item && (item.price_segment || item.priceSegment))
          .map((item: any) => ({
            price_segment: item.price_segment ?? item.priceSegment,
            keyword_count: Number(item.keyword_count ?? item.keywordCount ?? 0),
            search_volume: Number(item.search_volume ?? item.segment_count ?? item.search_count ?? 0),
            avg_max_price: Number(item.avg_max_price ?? item.avgMaxPrice ?? 0),
            min_price: Number(item.min_price ?? item.minPrice ?? 0),
            max_price: Number(item.max_price ?? item.maxPrice ?? 0),
          }));

        setData(filtered);
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

  // For pie: use search_volume; for stacked bar we can use the same search_volume
  const totalVolume = data.reduce((s, d) => s + (d.search_volume || 0), 0);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Price Intent Segments</Typography>
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
              onChange={(e, newType) => newType && setChartType(newType)}
              size="small"
            >
              <ToggleButton value="pie">Pie</ToggleButton>
              <ToggleButton value="bar">Stacked Bar</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && chartType === 'pie' && (
          <Box sx={{ width: '100%', height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="search_volume"
                  nameKey="price_segment"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  // label={(entry) => `${entry.price_segment}: ${((entry.search_volume / totalVolume) * 100).toFixed(1)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        )}

        {!loading && !error && data.length > 0 && chartType === 'bar' && (
          <Box sx={{ width: '100%', height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="price_segment" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="search_volume" fill="#2196F3" name="Search Volume" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        {!loading && !error && data.length > 0 && chartType === 'table' && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>price_segment</strong></TableCell>
                  <TableCell align="right"><strong>keyword_count</strong></TableCell>
                  <TableCell align="right"><strong>search_volume</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{row.price_segment}</TableCell>
                    <TableCell align="right">{row.keyword_count}</TableCell>
                    <TableCell align="right">{row.search_volume}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No price intent segment data available for the selected range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceIntentSegments;