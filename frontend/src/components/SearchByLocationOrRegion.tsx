// import React, { useEffect, useState } from 'react';
// import { analyticsAPI } from '../routes/api';

// interface SearchByLocationData {
//   location: string;
//   search_count: number;
// }

// export const SearchByLocationOrRegion: React.FC = () => {
//   const [data, setData] = useState<SearchByLocationData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result:any = await analyticsAPI.getSearchByLocationOrRegion();
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
//       <h1>Search by Location or Region</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Location</th>
//             <th>Search Count</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.location}</td>
//               <td>{item.search_count}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SearchByLocationOrRegion;



// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';
// import { analyticsAPI } from '../routes/api';

// interface SearchByLocationData {
//   location: string;
//   search_count: number;
// }

// export const SearchByLocationOrRegion: React.FC = () => {
//   const [data, setData] = useState<SearchByLocationData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await analyticsAPI.getSearchByLocationOrRegion();
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
//         <Typography variant="h5" sx={{ mb: 2 }}>Search by Location/Region</Typography>
//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
//         {!loading && !error && (
//           <Box sx={{ width: '100%', height: 400 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="location" angle={-45} textAnchor="end" height={100} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="search_count" fill="#ffc658" name="Search Count" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default SearchByLocationOrRegion;


// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
// import { analyticsAPI } from '../routes/api';

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, PieChart, Pie, Cell, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { analyticsAPI } from '../routes/api';

interface SearchByLocationData {
  region: string;
  search_count: number;
  unique_customers: number;
  avg_results: number;
  avg_rating: number;
  [key: string]: string | number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

export const SearchByLocationOrRegion: React.FC = () => {
  const [data, setData] = useState<SearchByLocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'table'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getSearchByLocationOrRegion();
        
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
          .filter((item: any) => item.region && item.region.trim() !== '')
          .map((item: any) => ({
            region: item.region,
            search_count: parseInt(item.search_count, 10),
            unique_customers: parseInt(item.unique_customers, 10),
            avg_results: parseFloat(item.avg_results),
            avg_rating: parseFloat(item.avg_rating)
          }))
          .sort((a: SearchByLocationData, b: SearchByLocationData) => b.search_count - a.search_count)
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
    newChartType: 'bar' | 'pie' | 'table',
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const totalSearches = data.reduce((sum, item) => sum + item.search_count, 0);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Search by Location / Region</Typography>
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
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="search_count" fill="#ffc658" name="Search Count" />
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
                      dataKey="search_count"
                      nameKey="region"
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
                      <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Region</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Count</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unique Customers</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avg Results</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avg Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.region}</TableCell>
                        <TableCell align="right">{item.search_count}</TableCell>
                        <TableCell align="right">
                          {totalSearches > 0 
                            ? ((item.search_count / totalSearches) * 100).toFixed(2) + '%'
                            : '0%'
                          }
                        </TableCell>
                        <TableCell align="right">{item.unique_customers}</TableCell>
                        <TableCell align="center">{item.avg_results.toFixed(1)}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            {'★'.repeat(Math.round(item.avg_rating))}
                            <span>({item.avg_rating.toFixed(1)})</span>
                          </Box>
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
          <Alert severity="info">No search by location/region data available</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchByLocationOrRegion;