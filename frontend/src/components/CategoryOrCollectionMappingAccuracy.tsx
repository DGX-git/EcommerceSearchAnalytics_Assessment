// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, ToggleButton, ToggleButtonGroup, LinearProgress, Chip, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface SampleKeyword {
//   keyword: string;
//   mapped_to: string;
//   expected: string;
//   correct: boolean;
//   count: number;
// }

// interface MappingAccuracyData {
//   category: string;
//   mapping_accuracy: number;
//   search_accuracy: number;
//   total_mappings: number;
//   correct_mappings: number;
//   total_searches: number;
//   expected_category: string;
//   sample_keywords: SampleKeyword[];
// }

// export const CategoryOrCollectionMappingAccuracy: React.FC = () => {
//   const [data, setData] = useState<MappingAccuracyData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'bar' | 'line' | 'table'>('bar');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.categoryOrCollectionMappingAccuracy);
        
//         let processedData = Array.isArray(result) ? result : [];
//         if (Array.isArray(result) && result.length > 0 && result[0] && Array.isArray(result[0])) {
//           processedData = result[0];
//         } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
//           processedData = result[1].rows;
//         }
        
//         setData(processedData.filter((item: MappingAccuracyData) => item && item.category));
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const chartData = data.map(item => ({
//     name: item.category,
//     mapping_accuracy: item.mapping_accuracy,
//     search_accuracy: item.search_accuracy
//   }));

//   const overallMappingAccuracy = data.length > 0 
//     ? Math.round(data.reduce((sum, item) => sum + item.mapping_accuracy, 0) / data.length)
//     : 0;

//   const overallSearchAccuracy = data.length > 0
//     ? Math.round(data.reduce((sum, item) => sum + item.search_accuracy, 0) / data.length)
//     : 0;

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Category/Collection Mapping Accuracy</Typography>
//           <ToggleButtonGroup value={chartType} exclusive onChange={(e, newType) => newType && setChartType(newType)}>
//             <ToggleButton value="bar">Bar</ToggleButton>
//             <ToggleButton value="line">Line</ToggleButton>
//             <ToggleButton value="table">Table</ToggleButton>
//           </ToggleButtonGroup>
//         </Box>
        
//         {/* Overall Accuracy Stats */}
//         <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
//           <Card variant="outlined">
//             <CardContent>
//               <Typography color="textSecondary">Overall Mapping Accuracy</Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
//                 <Typography variant="h4" sx={{ color: overallMappingAccuracy > 75 ? '#4caf50' : overallMappingAccuracy > 50 ? '#ff9800' : '#f44336' }}>
//                   {overallMappingAccuracy}%
//                 </Typography>
//                 <LinearProgress 
//                   variant="determinate" 
//                   value={overallMappingAccuracy}
//                   sx={{ flex: 1, height: 8, borderRadius: 4 }}
//                 />
//               </Box>
//             </CardContent>
//           </Card>
          
//           <Card variant="outlined">
//             <CardContent>
//               <Typography color="textSecondary">Overall Search Accuracy</Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
//                 <Typography variant="h4" sx={{ color: overallSearchAccuracy > 75 ? '#4caf50' : overallSearchAccuracy > 50 ? '#ff9800' : '#f44336' }}>
//                   {overallSearchAccuracy}%
//                 </Typography>
//                 <LinearProgress 
//                   variant="determinate" 
//                   value={overallSearchAccuracy}
//                   sx={{ flex: 1, height: 8, borderRadius: 4 }}
//                 />
//               </Box>
//             </CardContent>
//           </Card>
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
//                   <YAxis label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft' }} />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="mapping_accuracy" fill="#82ca9d" name="Mapping Accuracy" />
//                   <Bar dataKey="search_accuracy" fill="#8884d8" name="Search Accuracy" />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
            
//             {chartType === 'line' && (
//               <ResponsiveContainer width="100%" height={400}>
//                 <LineChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
//                   <YAxis label={{ value: 'Accuracy %', angle: -90, position: 'insideLeft' }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line type="monotone" dataKey="mapping_accuracy" stroke="#82ca9d" name="Mapping Accuracy" />
//                   <Line type="monotone" dataKey="search_accuracy" stroke="#8884d8" name="Search Accuracy" />
//                 </LineChart>
//               </ResponsiveContainer>
//             )}
            
//             {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                     <TableRow>
//                       <TableCell><strong>Category</strong></TableCell>
//                       <TableCell align="right"><strong>Mapping Accuracy</strong></TableCell>
//                       <TableCell align="right"><strong>Search Accuracy</strong></TableCell>
//                       <TableCell align="right"><strong>Total Mappings</strong></TableCell>
//                       <TableCell align="right"><strong>Correct Mappings</strong></TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((row, index) => (
//                       <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
//                         <TableCell sx={{ fontWeight: 'bold' }}>{row.category}</TableCell>
//                         <TableCell align="right">
//                           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
//                             <Typography sx={{ color: row.mapping_accuracy > 75 ? '#4caf50' : row.mapping_accuracy > 50 ? '#ff9800' : '#f44336', fontWeight: 'bold' }}>
//                               {row.mapping_accuracy}%
//                             </Typography>
//                             <LinearProgress variant="determinate" value={row.mapping_accuracy} sx={{ width: 60 }} />
//                           </Box>
//                         </TableCell>
//                         <TableCell align="right">
//                           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
//                             <Typography sx={{ color: row.search_accuracy > 75 ? '#4caf50' : row.search_accuracy > 50 ? '#ff9800' : '#f44336', fontWeight: 'bold' }}>
//                               {row.search_accuracy}%
//                             </Typography>
//                             <LinearProgress variant="determinate" value={row.search_accuracy} sx={{ width: 60 }} />
//                           </Box>
//                         </TableCell>
//                         <TableCell align="right">{row.total_mappings}</TableCell>
//                         <TableCell align="right" sx={{ color: '#388e3c', fontWeight: 'bold' }}>{row.correct_mappings}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
            
//             {/* Sample Keywords Accordion */}
//             <Box sx={{ mt: 3 }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>Mapping Details & Examples</Typography>
//               {data.map((item, index) => (
//                 <Accordion key={index}>
//                   <AccordionSummary expandIcon={<ExpandMoreIcon />}>
//                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
//                       <Typography sx={{ fontWeight: 'bold' }}>{item.category}</Typography>
//                       <Chip 
//                         label={`${item.search_accuracy}% Accurate`}
//                         color={item.search_accuracy > 75 ? 'success' : item.search_accuracy > 50 ? 'warning' : 'error'}
//                         size="small"
//                       />
//                     </Box>
//                   </AccordionSummary>
//                   <AccordionDetails>
//                     <TableContainer>
//                       <Table size="small">
//                         <TableHead>
//                           <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//                             <TableCell><strong>Keyword</strong></TableCell>
//                             <TableCell><strong>Mapped To</strong></TableCell>
//                             <TableCell><strong>Expected Category</strong></TableCell>
//                             <TableCell align="center"><strong>Correct?</strong></TableCell>
//                             <TableCell align="right"><strong>Search Count</strong></TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {item.sample_keywords.map((kw, idx) => (
//                             <TableRow key={idx}>
//                               <TableCell>{kw.keyword}</TableCell>
//                               <TableCell>
//                                 <Chip label={kw.mapped_to} size="small" variant="outlined" />
//                               </TableCell>
//                               <TableCell>
//                                 <Chip label={kw.expected} size="small" variant="outlined" color="primary" />
//                               </TableCell>
//                               <TableCell align="center">
//                                 <Chip 
//                                   label={kw.correct ? '✓ Correct' : '✗ Incorrect'} 
//                                   size="small"
//                                   color={kw.correct ? 'success' : 'error'}
//                                 />
//                               </TableCell>
//                               <TableCell align="right">{kw.count}</TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   </AccordionDetails>
//                 </Accordion>
//               ))}
//             </Box>

//             <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
//               <Typography variant="body2" sx={{ mb: 1 }}>
//                 <strong>Accuracy Metrics:</strong>
//               </Typography>
//               <Typography variant="body2">
//                 • <strong>Mapping Accuracy:</strong> % of keywords correctly mapped to their category out of total mappings
//               </Typography>
//               <Typography variant="body2">
//                 • <strong>Search Accuracy:</strong> Weighted accuracy by search volume (high-volume mismatches impact more)
//               </Typography>
//               <Typography variant="body2">
//                 • Example Issue: User searches "retinol" (should map to "anti-aging") but maps to "haircare" instead
//               </Typography>
//               <Typography variant="body2">
//                 • Red categories (&lt;50%): Need urgent improvement in search logic
//               </Typography>
//             </Box>
//           </Box>
//         )}
        
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="info">No category mapping data available</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default CategoryOrCollectionMappingAccuracy;






// frontend/src/components/CategoryOrCollectionMappingAccuracy.tsx
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
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
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  Chip,
  Button,
  TextField,
} from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface SampleKeyword {
  keyword: string;
  mapped_to: string;
  expected: string;
  correct: boolean;
  count: number;
}

interface MappingAccuracyData {
  category: string;
  mapping_accuracy: number;
  search_accuracy: number;
  total_mappings: number;
  correct_mappings: number;
  total_searches: number;
  expected_category: string;
  sample_keywords: SampleKeyword[];
}

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const CategoryOrCollectionMappingAccuracy: React.FC = () => {
  const [data, setData] = useState<MappingAccuracyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'table'>('bar');

  // date filter states
  const today = new Date();
  const defaultEnd = formatDate(today);
  const defaultStart = formatDate(new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000)); // last 28 days

  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);
  const [appliedStart, setAppliedStart] = useState<string>(defaultStart);
  const [appliedEnd, setAppliedEnd] = useState<string>(defaultEnd);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (appliedStart) params.append('startDate', appliedStart);
        if (appliedEnd) params.append('endDate', appliedEnd);
        const url = `${API_PATHS.categoryOrCollectionMappingAccuracy}${params.toString() ? `?${params.toString()}` : ''}`;
        const result: any = await fetchFromAPI(url);

        let processedData = Array.isArray(result) ? result : [];
        if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
          processedData = result[0];
        } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
          processedData = result[1].rows;
        }

        // ensure types & defaults
        const normalized: MappingAccuracyData[] = processedData.map((item: any) => ({
          category: item.category ?? 'Unknown',
          mapping_accuracy: Number(item.mapping_accuracy ?? 0),
          search_accuracy: Number(item.search_accuracy ?? 0),
          total_mappings: Number(item.total_mappings ?? 0),
          correct_mappings: Number(item.correct_mappings ?? 0),
          total_searches: Number(item.total_searches ?? 0),
          expected_category: item.expected_category ?? '',
          sample_keywords: Array.isArray(item.sample_keywords) ? item.sample_keywords : [],
        }));

        setData(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appliedStart, appliedEnd]);

  // Chart data: incorrect mapping count per category
  const chartData = data.map(item => ({
    name: item.category,
    incorrect_count: Math.max(0, (item.total_mappings ?? 0) - (item.correct_mappings ?? 0)),
  }));

  // Flatten sample_keywords into table rows
  const tableRows = data.flatMap(item =>
    (item.sample_keywords || []).map(sk => ({
      keyword: sk.keyword,
      mapped_category: sk.mapped_to,
      correct_category: sk.expected,
      accuracy_flag: Boolean(sk.correct),
    }))
  );

  const handleChartTypeChange = (e: React.MouseEvent<HTMLElement>, newType: any) => {
    if (newType) setChartType(newType);
  };

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
          <Typography variant="h5">Category/Collection Mapping Accuracy</Typography>

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

            <ToggleButtonGroup value={chartType} exclusive onChange={handleChartTypeChange} size="small">
              <ToggleButton value="bar">Bar</ToggleButton>
              <ToggleButton value="line">Line</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && (
          <>
            {chartType === 'bar' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="incorrect_count" fill="#f44336" name="Incorrect Mapping Count" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {chartType === 'line' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="incorrect_count" stroke="#f44336" name="Incorrect Mapping Count" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}

            {chartType === 'table' && (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><strong>keyword</strong></TableCell>
                      <TableCell><strong>mapped_category</strong></TableCell>
                      <TableCell><strong>correct_category</strong></TableCell>
                      <TableCell align="center"><strong>accuracy_flag</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">No sample keywords available for the selected range</TableCell>
                      </TableRow>
                    )}
                    {tableRows.map((row, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{row.keyword}</TableCell>
                        <TableCell>{row.mapped_category}</TableCell>
                        <TableCell>{row.correct_category}</TableCell>
                        <TableCell align="center">{row.accuracy_flag ? 'true' : 'false'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No category mapping data available for the selected range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryOrCollectionMappingAccuracy;