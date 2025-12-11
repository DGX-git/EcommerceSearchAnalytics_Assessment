// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface SynonymMissData {
//   keyword: string;
//   missed_variant: string;
//   miss_count: number;
//   synonym_found: number;
// }

// export const SynonymMisses: React.FC = () => {
//   const [data, setData] = useState<SynonymMissData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'bar' | 'table'>('bar');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.synonymMisses);
        
//         let processedData = Array.isArray(result) ? result : [];
//         if (Array.isArray(result) && result.length > 0 && result[0] && Array.isArray(result[0])) {
//           processedData = result[0];
//         } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
//           processedData = result[1].rows;
//         }
        
//         setData(processedData.filter((item: SynonymMissData) => item && item.keyword && item.missed_variant));
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const chartData = data.map(item => ({
//     name: `${item.keyword} → ${item.missed_variant}`,
//     misses: item.miss_count,
//     found: item.synonym_found
//   }));

//   const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Synonym Misses</Typography>
//           <ToggleButtonGroup value={chartType} exclusive onChange={(e, newType) => newType && setChartType(newType)}>
//             <ToggleButton value="bar">Bar Chart</ToggleButton>
//             <ToggleButton value="table">Table</ToggleButton>
//           </ToggleButtonGroup>
//         </Box>
        
//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
        
//         {!loading && !error && data.length > 0 && (
//           <Box>
//             {chartType === 'bar' && (
//               <ResponsiveContainer width="100%" height={400}>
//                 <BarChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="misses" fill="#ff7c7c" name="Zero Result Searches" />
//                   <Bar dataKey="found" fill="#82ca9d" name="Synonym Products Found" />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
            
//             {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                     <TableRow>
//                       <TableCell><strong>Searched Keyword</strong></TableCell>
//                       <TableCell><strong>Missed Variant (Should Match)</strong></TableCell>
//                       <TableCell align="right"><strong>Zero Result Searches</strong></TableCell>
//                       <TableCell align="right"><strong>Synonym Products Found</strong></TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((row, index) => (
//                       <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
//                         <TableCell sx={{ fontWeight: 'bold', color: '#d32f2f' }}>{row.keyword}</TableCell>
//                         <TableCell sx={{ color: '#388e3c' }}>{row.missed_variant}</TableCell>
//                         <TableCell align="right">{row.miss_count}</TableCell>
//                         <TableCell align="right">{row.synonym_found}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </Box>
//         )}
        
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="info">No synonym misses found</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default SynonymMisses;




import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Button,
} from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface SynonymMissRow {
  searched_keyword: string;
  expected_synonym: string;
  search_count: number;
  result_count: number;
}

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const SynonymMisses: React.FC = () => {
  const [data, setData] = useState<SynonymMissRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // date defaults: last 28 days
  const today = new Date();
  const defaultEnd = formatDate(today);
  const defaultStart = formatDate(new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000));

  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);
  const [appliedStart, setAppliedStart] = useState<string>(defaultStart);
  const [appliedEnd, setAppliedEnd] = useState<string>(defaultEnd);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (appliedStart) params.append('startDate', appliedStart);
        if (appliedEnd) params.append('endDate', appliedEnd);
        const url = `${API_PATHS.synonymMisses}${params.toString() ? `?${params.toString()}` : ''}`;

        const res: any = await fetchFromAPI(url);

        // Normalize driver shapes to an array of rows
        let rows: any[] = [];
        if (!res) rows = [];
        else if (Array.isArray(res)) {
          if (res.length > 0 && Array.isArray(res[0])) rows = res[0];
          else if (res.length > 1 && res[1] && res[1].rows) rows = res[1].rows;
          else rows = res;
        } else if (res.rows && Array.isArray(res.rows)) rows = res.rows;
        else if (Array.isArray(res.data)) rows = res.data;
        else rows = Array.isArray(res) ? res : [];

        const mapped: SynonymMissRow[] = (rows || [])
          .filter((r: any) => r && (r.searched_keyword || r.keyword || r.missed_keyword))
          .map((r: any) => {
            return {
              searched_keyword: String(r.searched_keyword ?? r.keyword ?? r.missed_keyword ?? 'Unknown'),
              expected_synonym: String(r.expected_synonym ?? r.missed_variant ?? r.synonym ?? 'Unknown'),
              search_count: Number(r.search_count ?? r.miss_count ?? 0) || 0,
              result_count: Number(r.result_count ?? r.synonym_found ?? r.synonym_hits ?? 0) || 0,
            };
          })
          .sort((a, b) => b.search_count - a.search_count)
          .slice(0, 200);

        setData(mapped);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch synonym misses');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [appliedStart, appliedEnd]);

  const onApply = () => {
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
  };

  const onReset = () => {
    setStartDate(defaultStart);
    setEndDate(defaultEnd);
    setAppliedStart(defaultStart);
    setAppliedEnd(defaultEnd);
  };

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5">Synonym Misses</Typography>
            <Typography variant="caption" color="textSecondary">
              Table only — missed zero-result searches and matching synonyms with results
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="Start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <TextField
              label="End"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
            <Button variant="outlined" onClick={onApply} size="small">Apply</Button>
            <Button variant="text" onClick={onReset} size="small">Reset</Button>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Searched Keyword</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Expected Synonym</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Count</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Result Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No synonym misses found for the selected range</TableCell>
                  </TableRow>
                )}
                {data.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{row.searched_keyword}</TableCell>
                    <TableCell>{row.expected_synonym}</TableCell>
                    <TableCell align="right">{row.search_count}</TableCell>
                    <TableCell align="right">{row.result_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && !error && data.length === 0 && <Alert severity="info" sx={{ mt: 2 }}>No synonym misses</Alert>}
      </CardContent>
    </Card>
  );
};

export default SynonymMisses;