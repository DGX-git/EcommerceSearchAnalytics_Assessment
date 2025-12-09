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



import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { analyticsAPI } from '../routes/api';

interface SynonymMissData {
  keyword: string;
  missed_variant: string;
  impact: number;
}

export const SynonymMisses: React.FC = () => {
  const [data, setData] = useState<SynonymMissData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getSynonymMisses();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Synonym Misses</Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><strong>Keyword</strong></TableCell>
                    <TableCell><strong>Missed Variant</strong></TableCell>
                    <TableCell align="right"><strong>Impact</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
                      <TableCell>{row.keyword}</TableCell>
                      <TableCell>{row.missed_variant}</TableCell>
                      <TableCell align="right">{row.impact}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SynonymMisses;