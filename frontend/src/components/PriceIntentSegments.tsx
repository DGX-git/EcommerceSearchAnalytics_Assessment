// import React, { useEffect, useState } from 'react';
// import { analyticsAPI } from '../routes/api';

// interface PriceIntentSegmentsData {
//   price_range: string;
//   segment: string;
//   count: number;
// }

// export const PriceIntentSegments: React.FC = () => {
//   const [data, setData] = useState<PriceIntentSegmentsData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result:any = await analyticsAPI.getPriceIntentSegments();
//         setData(result);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="component-container">
//       <h1>Price Intent Segments</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Price Range</th>
//             <th>Segment</th>
//             <th>Count</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.price_range}</td>
//               <td>{item.segment}</td>
//               <td>{item.count}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PriceIntentSegments;



// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';
// import { analyticsAPI } from '../routes/api';

// interface PriceIntentSegmentData {
//   price_range: string;
//   segment_count: number;
// }

// export const PriceIntentSegments: React.FC = () => {
//   const [data, setData] = useState<PriceIntentSegmentData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await analyticsAPI.getPriceIntentSegments();
//         setData(result);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Typography variant="h5" sx={{ mb: 2 }}>Price Intent Segments</Typography>
//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
//         {!loading && !error && (
//           <Box sx={{ width: '100%', height: 400 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="price_range" angle={-45} textAnchor="end" height={80} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="segment_count" fill="#82ca9d" name="Segment Count" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default PriceIntentSegments;


// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { analyticsAPI } from '../routes/api';


import React, { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, PieChart, Pie, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


interface PriceIntentSegmentData {
  price_segment: string;
  segment_count: number;
  avg_max_price: number;
  min_price: number;
  max_price: number;
  [key: string]: string | number;
}

const COLORS = ['#4CAF50', '#2196F3', '#FF9800'];

export const PriceIntentSegments: React.FC = () => {
  const [data, setData] = useState<PriceIntentSegmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'table'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getPriceIntentSegments();
        
        // Handle both array and nested array responses
        let processedData = Array.isArray(result) ? result : [];
        
        // If result is an array with metadata object, extract the data array
        if (Array.isArray(result) && result.length > 0 && result[0] && Array.isArray(result[0])) {
          processedData = result[0];
        } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
          processedData = result[1].rows;
        }
        
        // Filter and process data
        const filteredData = processedData
          .filter((item: any) => item.price_segment && item.price_segment.trim() !== '')
          .map((item: any) => ({
            price_segment: item.price_segment,
            segment_count: parseInt(item.segment_count, 10),
            avg_max_price: parseFloat(item.avg_max_price),
            min_price: parseInt(item.min_price, 10),
            max_price: parseInt(item.max_price, 10)
          }));
        
        setData(filteredData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: 'bar' | 'pie' | 'table',
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  // Calculate total for percentage display
  const totalSegments = data.reduce((sum, item) => sum + item.segment_count, 0);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Price Intent Segments</Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
          >
            <ToggleButton value="bar" aria-label="bar chart">
              Bar Chart
            </ToggleButton>
            <ToggleButton value="pie" aria-label="pie chart">
              Pie Chart
            </ToggleButton>
            <ToggleButton value="table" aria-label="table">
              Table
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && data.length > 0 && (
          <>
            {chartType === 'bar' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="price_segment" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="segment_count" fill="#2196F3" name="Search Count" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
            {chartType === 'pie' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="segment_count"
                      nameKey="price_segment"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label
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
            {chartType === 'table' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Price Segment</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Count</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Avg Max Price</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price Range</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{item.price_segment}</TableCell>
                        <TableCell align="right">{item.segment_count}</TableCell>
                        <TableCell align="right">
                          {totalSegments > 0 
                            ? ((item.segment_count / totalSegments) * 100).toFixed(2) + '%'
                            : '0%'
                          }
                        </TableCell>
                        <TableCell align="right">${item.avg_max_price.toFixed(2)}</TableCell>
                        <TableCell align="right">${item.min_price} - ${item.max_price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No price intent segment data available</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceIntentSegments;