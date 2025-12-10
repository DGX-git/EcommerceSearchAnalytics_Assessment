// import React, { useEffect, useState } from 'react';
// import { analyticsAPI } from '../routes/api';

// interface SynonymMissesData {
//   search_term: string;
//   missed_synonyms: string[];
// }

// export const SynonymMisses: React.FC = () => {
//   const [data, setData] = useState<SynonymMissesData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result:any = await analyticsAPI.getSynonymMisses();
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
//       <h1>Synonym Misses</h1>
//       {data.map((item, index) => (
//         <div key={index} className="synonym-item">
//           <h3>{item.search_term}</h3>
//           <p>Missed Synonyms:</p>
//           <ul>
//             {item.missed_synonyms.map((synonym, idx) => (
//               <li key={idx}>{synonym}</li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SynonymMisses;



// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
// import { analyticsAPI } from '../routes/api';

// interface SynonymMissData {
//   keyword: string;
//   missed_variant: string;
//   impact: number;
// }

// export const SynonymMisses: React.FC = () => {
//   const [data, setData] = useState<SynonymMissData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await analyticsAPI.getSynonymMisses();
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
//         <Typography variant="h5" sx={{ mb: 2 }}>Synonym Misses</Typography>
//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
//         {!loading && !error && (
//           <Box>
//             <TableContainer component={Paper}>
//               <Table>
//                 <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                   <TableRow>
//                     <TableCell><strong>Keyword</strong></TableCell>
//                     <TableCell><strong>Missed Variant</strong></TableCell>
//                     <TableCell align="right"><strong>Impact</strong></TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {data.map((row, index) => (
//                     <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
//                       <TableCell>{row.keyword}</TableCell>
//                       <TableCell>{row.missed_variant}</TableCell>
//                       <TableCell align="right">{row.impact}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default SynonymMisses;



import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { analyticsAPI } from '../routes/api';

interface SynonymMissData {
  keyword: string;
  missed_variant: string;
  miss_count: number;
  synonym_found: number;
}

export const SynonymMisses: React.FC = () => {
  const [data, setData] = useState<SynonymMissData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'table'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getSynonymMisses();
        
        let processedData = Array.isArray(result) ? result : [];
        if (Array.isArray(result) && result.length > 0 && result[0] && Array.isArray(result[0])) {
          processedData = result[0];
        } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
          processedData = result[1].rows;
        }
        
        setData(processedData.filter((item: SynonymMissData) => item && item.keyword && item.missed_variant));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = data.map(item => ({
    name: `${item.keyword} → ${item.missed_variant}`,
    misses: item.miss_count,
    found: item.synonym_found
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Synonym Misses</Typography>
          <ToggleButtonGroup value={chartType} exclusive onChange={(e, newType) => newType && setChartType(newType)}>
            <ToggleButton value="bar">Bar Chart</ToggleButton>
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
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="misses" fill="#ff7c7c" name="Zero Result Searches" />
                  <Bar dataKey="found" fill="#82ca9d" name="Synonym Products Found" />
                </BarChart>
              </ResponsiveContainer>
            )}
            
            {chartType === 'table' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><strong>Searched Keyword</strong></TableCell>
                      <TableCell><strong>Missed Variant (Should Match)</strong></TableCell>
                      <TableCell align="right"><strong>Zero Result Searches</strong></TableCell>
                      <TableCell align="right"><strong>Synonym Products Found</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                        <TableCell sx={{ fontWeight: 'bold', color: '#d32f2f' }}>{row.keyword}</TableCell>
                        <TableCell sx={{ color: '#388e3c' }}>{row.missed_variant}</TableCell>
                        <TableCell align="right">{row.miss_count}</TableCell>
                        <TableCell align="right">{row.synonym_found}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
        
        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No synonym misses found</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SynonymMisses;