// import React, { useEffect, useState } from 'react';
// import { analyticsAPI } from '../routes/api';

// interface CategoryDemandData {
//   category: string;
//   demand: number;
// }

// export const CategoryDemand: React.FC = () => {
//   const [data, setData] = useState<CategoryDemandData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result:any = await analyticsAPI.getCategoryDemand();
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
//       <h1>Category Demand</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Category</th>
//             <th>Demand</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.category}</td>
//               <td>{item.demand}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CategoryDemand;




// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';
// import { analyticsAPI } from '../routes/api';

// interface CategoryDemandData {
//   category: string;
//   demand: number;
// }

// export const CategoryDemand: React.FC = () => {
//   const [data, setData] = useState<CategoryDemandData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await analyticsAPI.getCategoryDemand();
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
//         <Typography variant="h5" sx={{ mb: 2 }}>Category Demand</Typography>
//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
//         {!loading && !error && (
//           <Box sx={{ width: '100%', height: 400 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="demand" fill="#82ca9d" name="Demand" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default CategoryDemand;




// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
// import { analyticsAPI } from '../routes/api';


import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { analyticsAPI } from '../routes/api';

interface CategoryDemandData {
  category: string;
  demand: number;
  [key: string]: string | number;
}

export const CategoryDemand: React.FC = () => {
  const [data, setData] = useState<CategoryDemandData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'table'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getCategoryDemand();
        
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
          .filter((item: any) => item.category && item.category.trim() !== '')
          .map((item: any) => ({
            category: item.category,
            demand: parseInt(item.demand, 10)
          }))
          .sort((a: CategoryDemandData, b: CategoryDemandData) => b.demand - a.demand)
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
    newChartType: 'bar' | 'line' | 'table',
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  // Calculate total demand for percentage display
  const totalDemand = data.reduce((sum, item) => sum + item.demand, 0);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Category Demand</Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
          >
            <ToggleButton value="bar" aria-label="bar chart">
              Bar Chart
            </ToggleButton>
            <ToggleButton value="line" aria-label="line chart">
              Line Chart
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
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="demand" fill="#82ca9d" name="Demand" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
            {chartType === 'line' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="demand" stroke="#82ca9d" strokeWidth={2} dot={{ fill: '#82ca9d' }} name="Demand" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}
            {chartType === 'table' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Demand</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell align="right">{item.demand}</TableCell>
                        <TableCell align="right">
                          {totalDemand > 0 
                            ? ((item.demand / totalDemand) * 100).toFixed(2) + '%'
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
          <Alert severity="info">No category demand data available</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryDemand;