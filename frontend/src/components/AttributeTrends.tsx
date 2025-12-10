// import React, { useEffect, useState } from 'react';
// import { analyticsAPI } from '../routes/api';

// interface AttributeTrendsData {
//   attribute: string;
//   trend_value: number;
// }

// export const AttributeTrends: React.FC = () => {
//   const [data, setData] = useState<AttributeTrendsData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result:any = await analyticsAPI.getAttributeTrends();
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
//       <h1>Attribute Trends</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Attribute</th>
//             <th>Trend Value</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.attribute}</td>
//               <td>{item.trend_value}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AttributeTrends;




// import React, { useEffect, useState } from 'react';
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';
// import { analyticsAPI } from '../routes/api';

// interface AttributeTrendsData {
//   attribute: string;
//   trend_value: number;
// }

// export const AttributeTrends: React.FC = () => {
//   const [data, setData] = useState<AttributeTrendsData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await analyticsAPI.getAttributeTrends();
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
//         <Typography variant="h5" sx={{ mb: 2 }}>Attribute Trends</Typography>
//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
//         {!loading && !error && (
//           <Box sx={{ width: '100%', height: 400 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="attribute" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Area type="monotone" dataKey="trend_value" fill="#8884d8" stroke="#8884d8" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default AttributeTrends;


// import React, { useEffect, useState } from 'react';
// import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
// import { analyticsAPI } from '../routes/api';

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { analyticsAPI } from '../routes/api';

interface AttributeTrendsData {
  attribute: string;
  trend_value: number;
  [key: string]: string | number;
}

export const AttributeTrends: React.FC = () => {
  const [data, setData] = useState<AttributeTrendsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'area' | 'bar' | 'table'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getAttributeTrends();
        
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
          .filter((item: any) => item.attribute && item.attribute.trim() !== '')
          .map((item: any) => ({
            attribute: item.attribute,
            trend_value: parseInt(item.trend_value, 10)
          }))
          .sort((a: AttributeTrendsData, b: AttributeTrendsData) => b.trend_value - a.trend_value)
          .slice(0, 20);
        
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
    newChartType: 'area' | 'bar' | 'table',
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  // Calculate total for percentage display
  const totalTrends = data.reduce((sum, item) => sum + item.trend_value, 0);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Attribute Trends (vegan/SPF/acne-safe...)</Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
          >
            <ToggleButton value="area" aria-label="area chart">
              Area Chart
            </ToggleButton>
            <ToggleButton value="bar" aria-label="bar chart">
              Bar Chart
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
            {chartType === 'area' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="attribute" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="trend_value" fill="#8884d8" stroke="#8884d8" name="Search Interest" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            )}
            {chartType === 'bar' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="attribute" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="trend_value" fill="#8884d8" name="Search Interest" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
            {chartType === 'table' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Attribute</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Interest</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Chip label={item.attribute} variant="outlined" size="small" />
                        </TableCell>
                        <TableCell align="right">{item.trend_value}</TableCell>
                        <TableCell align="right">
                          {totalTrends > 0 
                            ? ((item.trend_value / totalTrends) * 100).toFixed(2) + '%'
                            : '0%'
                          }
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
          <Alert severity="info">No attribute trend data available</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AttributeTrends;