// import React, { useEffect, useState } from 'react';
// import { analyticsAPI } from '../routes/api';

// interface ConversionFunnelData {
//   stage: string;
//   count: number;
// }

// export const ConversionIntentFunnel: React.FC = () => {
//   const [data, setData] = useState<ConversionFunnelData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result:any = await analyticsAPI.getConversionIntentFunnel();
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
//       <h1>Conversion Intent Funnel</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Stage</th>
//             <th>Count</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.stage}</td>
//               <td>{item.count}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ConversionIntentFunnel;




// import React, { useEffect, useState } from 'react';
// import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';
// import { analyticsAPI } from '../routes/api';

// interface ConversionFunnelData {
//   stage: string;
//   count: number;
//   [key: string]: string | number; // Add this for Recharts compatibility
// }

// const COLORS = ['#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#0088FE', '#00C49F'];

// export const ConversionIntentFunnel: React.FC = () => {
//   const [data, setData] = useState<ConversionFunnelData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await analyticsAPI.getConversionIntentFunnel();
//         const chartData = Array.isArray(result) ? result : [result];
//         setData(chartData as ConversionFunnelData[]);
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
//         <Typography variant="h5" sx={{ mb: 2 }}>Conversion Intent Funnel</Typography>
//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
//         {!loading && !error && (
//           <Box sx={{ width: '100%', height: 400 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={data} dataKey="count" nameKey="stage" cx="50%" cy="50%" outerRadius={100} label>
//                   {data.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default ConversionIntentFunnel;



import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, ToggleButton, ToggleButtonGroup, LinearProgress } from '@mui/material';
import { analyticsAPI } from '../routes/api';

interface FunnelStageData {
  stage: string;
  count: number;
  percentage: number;
}

export const ConversionIntentFunnel: React.FC = () => {
  const [data, setData] = useState<FunnelStageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'table'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getConversionIntentFunnel();
        
        let processedData = Array.isArray(result) ? result : [];
        if (Array.isArray(result) && result.length > 0 && result[0] && Array.isArray(result[0])) {
          processedData = result[0];
        } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
          processedData = result[1].rows;
        }
        
        setData(processedData.filter((item: FunnelStageData) => item && item.stage));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Conversion Intent Funnel</Typography>
          <ToggleButtonGroup value={chartType} exclusive onChange={(e, newType) => newType && setChartType(newType)}>
            <ToggleButton value="bar">Bar</ToggleButton>
            <ToggleButton value="line">Line</ToggleButton>
            <ToggleButton value="table">Table</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        
        {!loading && !error && data.length > 0 && (
          <Box>
            {chartType === 'bar' && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis yAxisId="left" label={{ value: 'Search Count', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Conversion %', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" fill="#8884D8" name="Search Count" />
                  <Bar yAxisId="right" dataKey="percentage" fill="#82CA9D" name="Conversion %" />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'line' && (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis yAxisId="left" label={{ value: 'Search Count', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'Conversion %', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="count" stroke="#8884D8" name="Search Count" />
                  <Line yAxisId="right" type="monotone" dataKey="percentage" stroke="#82CA9D" name="Conversion %" />
                </LineChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'table' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><strong>Funnel Stage</strong></TableCell>
                      <TableCell align="right"><strong>Search Count</strong></TableCell>
                      <TableCell align="right"><strong>Conversion %</strong></TableCell>
                      <TableCell><strong>Progress</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>{row.stage}</TableCell>
                        <TableCell align="right">{row.count.toLocaleString()}</TableCell>
                        <TableCell align="right" sx={{ color: row.percentage > 50 ? '#388e3c' : '#d32f2f', fontWeight: 'bold' }}>
                          {row.percentage}%
                        </TableCell>
                        <TableCell>
                          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={row.percentage}
                              sx={{ 
                                flex: 1,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: row.percentage > 50 ? '#4caf50' : row.percentage > 25 ? '#ff9800' : '#f44336'
                                }
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Funnel Analysis:</strong>
              </Typography>
              <Typography variant="body2">
                • <strong>Search:</strong> Total search instances in the platform
              </Typography>
              <Typography variant="body2">
                • <strong>Product View:</strong> Searches that returned products (total_results &gt; 0)
              </Typography>
              <Typography variant="body2">
                • <strong>Add to Cart:</strong> Searches with good product availability, pricing, and ratings (rating ≥ 3)
              </Typography>
              <Typography variant="body2">
                • <strong>Purchase Intent:</strong> Repeat searches by engaged customers (3+ searches), indicating high purchase likelihood
              </Typography>
            </Box>
          </Box>
        )}
        
        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No conversion funnel data available</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversionIntentFunnel;