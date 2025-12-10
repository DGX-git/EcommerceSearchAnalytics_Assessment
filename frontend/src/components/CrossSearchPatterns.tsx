// import React, { useEffect, useState } from 'react';
// import { analyticsAPI } from '../routes/api';

// interface CrossSearchPatternsData {
//   pattern: string;
//   frequency: number;
// }

// export const CrossSearchPatterns: React.FC = () => {
//   const [data, setData] = useState<CrossSearchPatternsData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result:any = await analyticsAPI.getCrossSearchPatterns();
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
//       <h1>Cross Search Patterns</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Pattern</th>
//             <th>Frequency</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.pattern}</td>
//               <td>{item.frequency}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CrossSearchPatterns;



// import React, { useEffect, useState } from 'react';
// import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';
// import { analyticsAPI } from '../routes/api';

// interface CrossSearchPatternsData {
//   pattern: string;
//   frequency: number;
//   user_count: number;
// }

// export const CrossSearchPatterns: React.FC = () => {
//   const [data, setData] = useState<CrossSearchPatternsData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await analyticsAPI.getCrossSearchPatterns();
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
//         <Typography variant="h5" sx={{ mb: 2 }}>Cross Search Patterns</Typography>
//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
//         {!loading && !error && (
//           <Box sx={{ width: '100%', height: 400 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="frequency" type="number" />
//                 <YAxis dataKey="user_count" type="number" />
//                 <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//                 <Legend />
//                 <Scatter name="Cross Search Patterns" data={data} fill="#8884d8" />
//               </ScatterChart>
//             </ResponsiveContainer>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default CrossSearchPatterns;




import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, ToggleButton, ToggleButtonGroup, Chip, Stack } from '@mui/material';
import { analyticsAPI } from '../routes/api';

interface CrossSearchPatternData {
  pattern: string;
  frequency: number;
  user_count: number;
  pattern_percentage: number;
}

export const CrossSearchPatterns: React.FC = () => {
  const [data, setData] = useState<CrossSearchPatternData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'scatter' | 'table'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getCrossSearchPatterns();
        
        let processedData = Array.isArray(result) ? result : [];
        if (Array.isArray(result) && result.length > 0 && result[0] && Array.isArray(result[0])) {
          processedData = result[0];
        } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
          processedData = result[1].rows;
        }
        
        setData(processedData.filter((item: CrossSearchPatternData) => item && item.pattern));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = data.map(item => ({
    name: item.pattern,
    frequency: item.frequency,
    user_count: item.user_count,
    percentage: item.pattern_percentage
  }));

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Cross-Search Patterns</Typography>
          <ToggleButtonGroup value={chartType} exclusive onChange={(e, newType) => newType && setChartType(newType)}>
            <ToggleButton value="bar">Bar</ToggleButton>
            <ToggleButton value="scatter">Scatter</ToggleButton>
            <ToggleButton value="table">Table</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        
        {!loading && !error && data.length > 0 && (
          <Box>
            {chartType === 'bar' && (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} interval={0} />
                  <YAxis yAxisId="left" label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: 'User Count', angle: 90, position: 'insideRight' }} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="frequency" fill="#8884d8" name="Pattern Frequency" />
                  <Bar yAxisId="right" dataKey="user_count" fill="#82ca9d" name="Unique Users" />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'scatter' && (
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="frequency" 
                    type="number"
                    label={{ value: 'Pattern Frequency', position: 'insideBottomRight', offset: -10 }}
                  />
                  <YAxis 
                    dataKey="user_count"
                    type="number"
                    label={{ value: 'Unique Users', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter 
                    name="Cross-Search Patterns" 
                    data={chartData} 
                    fill="#8884d8"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'table' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><strong>Search Pattern (First → Next)</strong></TableCell>
                      <TableCell align="right"><strong>Frequency</strong></TableCell>
                      <TableCell align="right"><strong>Unique Users</strong></TableCell>
                      <TableCell align="right"><strong>Pattern %</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => {
                      const [firstKeyword, nextKeyword] = row.pattern.split(' → ');
                      return (
                        <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Chip label={firstKeyword} size="small" variant="outlined" />
                              <Typography variant="body2">→</Typography>
                              <Chip label={nextKeyword} size="small" color="primary" />
                            </Stack>
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                            {row.frequency}
                          </TableCell>
                          <TableCell align="right">{row.user_count}</TableCell>
                          <TableCell align="right" sx={{ color: '#388e3c', fontWeight: 'bold' }}>
                            {row.pattern_percentage}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Pattern Insights:</strong>
              </Typography>
              <Typography variant="body2">
                • Shows search sequences where customers searched one keyword followed by another within 7 days
              </Typography>
              <Typography variant="body2">
                • Example: "serum" → "vitamin C" indicates users searching for serum often search for vitamin C next
              </Typography>
              <Typography variant="body2">
                • Frequency: Number of times this pattern occurred across all customers
              </Typography>
              <Typography variant="body2">
                • Unique Users: Count of distinct customers who exhibited this pattern
              </Typography>
              <Typography variant="body2">
                • Pattern %: Percentage of total searches this pattern represents
              </Typography>
            </Box>
          </Box>
        )}
        
        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No cross-search patterns found</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CrossSearchPatterns;