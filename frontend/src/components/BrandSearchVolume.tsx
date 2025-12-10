// import React, { useEffect, useState } from 'react';
// import { analyticsAPI } from '../routes/api';

// interface BrandSearchVolumeData {
//   brand: string;
//   volume: number;
// }

// export const BrandSearchVolume: React.FC = () => {
//   const [data, setData] = useState<BrandSearchVolumeData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result:any = await analyticsAPI.getBrandSearchVolume();
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
//       <h1>Brand Search Volume</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Brand</th>
//             <th>Volume</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.brand}</td>
//               <td>{item.volume}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BrandSearchVolume;




// import React, { useEffect, useState } from 'react';
// import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';
// import { analyticsAPI } from '../routes/api';

// interface BrandSearchVolumeData {
//   brand: string;
//   volume: number;
//   [key: string]: string | number; // Add this for Recharts compatibility
// }

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

// export const BrandSearchVolume: React.FC = () => {
//   const [data, setData] = useState<BrandSearchVolumeData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await analyticsAPI.getBrandSearchVolume();
//         // setData(result);
//         const chartData = Array.isArray(result) ? result : [result];
//         setData(chartData as BrandSearchVolumeData[]);
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
//         <Typography variant="h5" sx={{ mb: 2 }}>Brand Search Volume</Typography>
//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
//         {!loading && !error && (
//           <Box sx={{ width: '100%', height: 400 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={data} dataKey="volume" nameKey="brand" cx="50%" cy="50%" outerRadius={100} label>
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

// export default BrandSearchVolume;



import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { analyticsAPI } from '../routes/api';

interface BrandSearchVolumeData {
  brand: string;
  search_volume: number;
  [key: string]: string | number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#0088FE', '#82D982'];

export const BrandSearchVolume: React.FC = () => {
  const [data, setData] = useState<BrandSearchVolumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'table'>('pie');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getBrandSearchVolume();
        
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
          .filter((item: any) => item.brand && item.brand.trim() !== '')
          .map((item: any) => ({
            brand: item.brand,
            search_volume: parseInt(item.search_volume, 10)
          }))
          .sort((a: BrandSearchVolumeData, b: BrandSearchVolumeData) => b.search_volume - a.search_volume)
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
    newChartType: 'pie' | 'bar' | 'table',
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  // Calculate total for percentage display
  const totalSearchVolume = data.reduce((sum, item) => sum + item.search_volume, 0);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Brand Search Volume</Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
          >
            <ToggleButton value="pie" aria-label="pie chart">
              Pie Chart
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
            {/* {chartType === 'pie' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={data} 
                      dataKey="search_volume" 
                      nameKey="brand" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={120}
                      label={({ brand, value }) => `${brand}: ${value}`}
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
            )} */}
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
          outerRadius={120}
          label={({ name, value }) => `${name}: ${value}`}
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
            {/* {chartType === 'table' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Brand</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Volume</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.brand}</TableCell>
                        <TableCell align="right">{item.search_volume}</TableCell>
                        <TableCell align="right">
                          {totalSearchVolume > 0 
                            ? ((item.search_volume / totalSearchVolume) * 100).toFixed(2) + '%'
                            : '0%'
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )} */}
          </>
        )}
        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No brand search volume data available</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default BrandSearchVolume;