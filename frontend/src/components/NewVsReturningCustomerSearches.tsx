// import React, { useEffect, useState } from 'react';
// import { analyticsAPI } from '../routes/api';

// interface CustomerSearchesData {
//   customer_type: string;
//   searches: number;
// }

// export const NewVsReturningCustomerSearches: React.FC = () => {
//   const [data, setData] = useState<CustomerSearchesData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result:any = await analyticsAPI.getNewVsReturningCustomerSearches();
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
//       <h1>New vs Returning Customer Searches</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Customer Type</th>
//             <th>Searches</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.customer_type}</td>
//               <td>{item.searches}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default NewVsReturningCustomerSearches;



// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';
// import { analyticsAPI } from '../routes/api';

// interface NewVsReturningData {
//   customer_type: string;
//   search_count: number;
// }

// export const NewVsReturningCustomerSearches: React.FC = () => {
//   const [data, setData] = useState<NewVsReturningData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await analyticsAPI.getNewVsReturningCustomerSearches();
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
//         <Typography variant="h5" sx={{ mb: 2 }}>New vs Returning Customer Searches</Typography>
//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
//         {!loading && !error && (
//           <Box sx={{ width: '100%', height: 400 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="customer_type" angle={-45} textAnchor="end" height={80} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="search_count" fill="#8884d8" name="Search Count" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default NewVsReturningCustomerSearches;


// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, LinearProgress } from '@mui/material';
// import { analyticsAPI } from '../routes/api';

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress } from '@mui/material';
import { analyticsAPI } from '../routes/api';

interface NewVsReturningData {
  customer_type: string;
  unique_customers: number;
  total_searches: number;
  avg_searches_per_customer: number;
  avg_rating: number;
  avg_results: number;
  [key: string]: string | number;
}

const COLORS = ['#ff9999', '#66b3ff'];

export const NewVsReturningCustomerSearches: React.FC = () => {
  const [data, setData] = useState<NewVsReturningData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'table'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getNewVsReturningCustomerSearches();
        
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
          .filter((item: any) => item.customer_type && item.customer_type.trim() !== '')
          .map((item: any) => ({
            customer_type: item.customer_type,
            unique_customers: parseInt(item.unique_customers, 10),
            total_searches: parseInt(item.total_searches, 10),
            avg_searches_per_customer: parseFloat(item.avg_searches_per_customer),
            avg_rating: parseFloat(item.avg_rating),
            avg_results: parseFloat(item.avg_results)
          }))
          .sort((a: NewVsReturningData, b: NewVsReturningData) => b.total_searches - a.total_searches);
        
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

  const totalSearches = data.reduce((sum, item) => sum + item.total_searches, 0);
  const totalCustomers = data.reduce((sum, item) => sum + item.unique_customers, 0);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">New vs Returning Customer Searches</Typography>
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

        {/* Summary Statistics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
          <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" color="textSecondary">Total Customers</Typography>
            <Typography variant="h6">{totalCustomers.toLocaleString()}</Typography>
          </Box>
          <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" color="textSecondary">Total Searches</Typography>
            <Typography variant="h6">{totalSearches.toLocaleString()}</Typography>
          </Box>
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
                    <XAxis dataKey="customer_type" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="total_searches" fill="#8884d8" name="Total Searches" />
                    <Bar yAxisId="right" dataKey="unique_customers" fill="#82ca9d" name="Unique Customers" />
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
                      dataKey="total_searches"
                      nameKey="customer_type"
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
                      <TableCell sx={{ fontWeight: 'bold' }}>Customer Type</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unique Customers</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Searches</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Searches</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Avg Searches/Customer</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avg Rating</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Avg Results</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell
                          sx={{
                            fontWeight: 'bold',
                            color: item.customer_type === 'New Customers' ? '#ff9999' : '#66b3ff'
                          }}
                        >
                          {item.customer_type}
                        </TableCell>
                        <TableCell align="right">{item.unique_customers.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                            <Box sx={{ width: 80 }}>
                              <LinearProgress
                                variant="determinate"
                                value={(item.total_searches / totalSearches) * 100}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: '#e0e0e0',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: COLORS[index % COLORS.length]
                                  }
                                }}
                              />
                            </Box>
                            <span>{item.total_searches.toLocaleString()}</span>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {totalSearches > 0 
                            ? ((item.total_searches / totalSearches) * 100).toFixed(1) + '%'
                            : '0%'
                          }
                        </TableCell>
                        <TableCell align="right">{item.avg_searches_per_customer.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          {'★'.repeat(Math.round(item.avg_rating))}
                          <Typography variant="caption">({item.avg_rating.toFixed(1)})</Typography>
                        </TableCell>
                        <TableCell align="right">{item.avg_results.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No customer search data available</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default NewVsReturningCustomerSearches;