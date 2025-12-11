// // import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
// // import React, { useEffect, useState } from 'react';
// // import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// // import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,  Accordion, AccordionSummary, AccordionDetails, LinearProgress } from '@mui/material';
// // import { fetchFromAPI } from '../utils';
// // import { API_PATHS } from '../constants';

// // interface Keyword {
// //   keyword: string;
// //   search_count: number;
// // }

// // interface KeywordClusteringData {
// //   cluster_name: string;
// //   keywords: Keyword[];
// //   total_searches: number;
// //   [key: string]: string | number | Keyword[];
// // }

// // const CLUSTER_COLORS: Record<string, string> = {
// //   'Face Moisturizers': '#8884d8',
// //   'Sunscreen & SPF': '#ffc658',
// //   'Face Cleansers': '#82ca9d',
// //   'Serums & Treatments': '#d084d0',
// //   'Lip Care': '#ff7c7c',
// //   'Eye Care': '#00c49f',
// //   'Masks & Exfoliants': '#ffb028',
// //   'Acne & Spot Treatment': '#ff6b9d',
// //   'Natural & Organic': '#76b041',
// //   'Anti-Aging': '#8884d8',
// //   'Other': '#999999'
// // };

// // export const KeywordClustering: React.FC = () => {
// //   const [data, setData] = useState<KeywordClusteringData[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [chartType, setChartType] = useState<'bar' | 'table'>('bar');

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         setLoading(true);
// //         const result: any = await fetchFromAPI(API_PATHS.keywordClustering);
        
// //         // Handle both array and nested array responses
// //         let processedData = Array.isArray(result) ? result : [];
        
// //         // If result is an array with metadata object, extract the data array
// //         if (Array.isArray(result) && result.length > 0 && result[0] && Array.isArray(result[0])) {
// //           processedData = result[0];
// //         } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
// //           processedData = result[1].rows;
// //         }
        
// //         // Filter and process data
// //         const filteredData = processedData
// //           .filter((item: any) => item.cluster_name && item.keywords && item.keywords.length > 0)
// //           .map((item: any) => ({
// //             cluster_name: item.cluster_name,
// //             keywords: Array.isArray(item.keywords) 
// //               ? item.keywords.map((k: any) => ({
// //                   keyword: typeof k === 'string' ? k : k.keyword,
// //                   search_count: typeof k === 'string' ? 0 : k.search_count
// //                 }))
// //               : [],
// //             total_searches: parseInt(item.total_searches, 10)
// //           }))
// //           .sort((a: KeywordClusteringData, b: KeywordClusteringData) => 
// //   (b.total_searches as number) - (a.total_searches as number)
// // );
        
// //         setData(filteredData);
// //       } catch (err) {
// //         setError(err instanceof Error ? err.message : 'Failed to fetch data');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchData();
// //   }, []);

// //   const handleChartTypeChange = (
// //     event: React.MouseEvent<HTMLElement>,
// //     newChartType: 'bar' | 'table',
// //   ) => {
// //     if (newChartType !== null) {
// //       setChartType(newChartType);
// //     }
// //   };

// //   const chartData = data.map(item => ({
// //     cluster_name: item.cluster_name,
// //     total_searches: item.total_searches
// //   }));

// //   // const totalSearches = data.reduce((sum, item) => sum + parseInt(item.total_searches as string, 10), 0);

// //   const totalSearches = data.reduce((sum, item) => sum + (item.total_searches as number), 0);


// //   return (
// //     <Card sx={{ m: 2 }}>
// //       <CardContent>
// //         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
// //           <Typography variant="h5">Keyword Clustering</Typography>
// //           <ToggleButtonGroup
// //             value={chartType}
// //             exclusive
// //             onChange={handleChartTypeChange}
// //             aria-label="chart type"
// //           >
// //             <ToggleButton value="bar" aria-label="bar chart">
// //               Bar Chart
// //             </ToggleButton>
// //             <ToggleButton value="table" aria-label="table">
// //               Details
// //             </ToggleButton>
// //           </ToggleButtonGroup>
// //         </Box>
        
// //         {loading && <CircularProgress />}
// //         {error && <Alert severity="error">{error}</Alert>}
// //         {!loading && !error && data.length > 0 && (
// //           <>
// //             {chartType === 'bar' && (
// //               <Box sx={{ width: '100%', height: 400 }}>
// //                 <ResponsiveContainer width="100%" height="100%">
// //                   <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
// //                     <CartesianGrid strokeDasharray="3 3" />
// //                     <XAxis dataKey="cluster_name" angle={-45} textAnchor="end" height={100} />
// //                     <YAxis />
// //                     <Tooltip />
// //                     <Legend />
// //                     <Bar dataKey="total_searches" fill="#8884d8" name="Total Searches" />
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               </Box>
// //             )}
// //             {chartType === 'table' && (
// //               <Box>
// //                 {data.map((cluster, index) => (
// //                   <Accordion key={index} defaultExpanded={index === 0}>
// //                     <AccordionSummary expandIcon={<ExpandMoreIcon />}>
// //                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
// //                         <Box
// //                           sx={{
// //                             width: 16,
// //                             height: 16,
// //                             backgroundColor: CLUSTER_COLORS[cluster.cluster_name] || '#999',
// //                             borderRadius: '2px'
// //                           }}
// //                         />
// //                         <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 1 }}>
// //                           {cluster.cluster_name}
// //                         </Typography>
// //                         <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
// //                           <Typography variant="caption" color="textSecondary">
// //                             {(cluster.keywords as Keyword[]).length} keywords
// //                           </Typography>
// //                           <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
// //                             {cluster.total_searches} searches
// //                           </Typography>
// //                           <Box sx={{ width: 100 }}>
// //                             <LinearProgress
// //                               variant="determinate"
// //                               // value={(parseInt(cluster.total_searches as string, 10) / totalSearches) * 100}
// //                               value={((cluster.total_searches as number) / totalSearches) * 100}
                              
// //                               sx={{
// //                                 height: 6,
// //                                 borderRadius: 3,
// //                                 backgroundColor: '#e0e0e0',
// //                                 '& .MuiLinearProgress-bar': {
// //                                   backgroundColor: CLUSTER_COLORS[cluster.cluster_name] || '#999'
// //                                 }
// //                               }}
// //                             />
// //                           </Box>
// //                         </Box>
// //                       </Box>
// //                     </AccordionSummary>
// //                     <AccordionDetails>
// //                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
// //                         {(cluster.keywords as Keyword[]).map((kw, idx) => (
// //                           <Chip
// //                             key={idx}
// //                             label={`${kw.keyword} (${kw.search_count})`}
// //                             variant="outlined"
// //                             size="small"
// //                             sx={{
// //                               borderColor: CLUSTER_COLORS[cluster.cluster_name] || '#999',
// //                               color: CLUSTER_COLORS[cluster.cluster_name] || '#999'
// //                             }}
// //                           />
// //                         ))}
// //                       </Box>
// //                     </AccordionDetails>
// //                   </Accordion>
// //                 ))}
// //               </Box>
// //             )}
// //           </>
// //         )}
// //         {!loading && !error && data.length === 0 && (
// //           <Alert severity="info">No keyword clustering data available</Alert>
// //         )}
// //       </CardContent>
// //     </Card>
// //   );
// // };

// // export default KeywordClustering;



// // frontend/src/components/KeywordClustering.tsx
// import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
// import React, { useEffect, useState } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
// import {
//   Box,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   Typography,
//   ToggleButton,
//   ToggleButtonGroup,
//   Table,
//   Chip,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   LinearProgress,
//   TextField,
//   Button,
//   Stack,
// } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface Keyword {
//   keyword: string;
//   search_count: number;
// }

// interface KeywordClusteringData {
//   cluster_name: string;
//   keywords: Keyword[] | string[]; // backend may return array of strings or objects
//   total_searches: number;
//   [key: string]: any;
// }

// const CLUSTER_COLORS: Record<string, string> = {
//   'Face Moisturizers': '#8884d8',
//   'Sunscreen & SPF': '#ffc658',
//   'Face Cleansers': '#82ca9d',
//   'Serums & Treatments': '#d084d0',
//   'Lip Care': '#ff7c7c',
//   'Eye Care': '#00c49f',
//   'Masks & Exfoliants': '#ffb028',
//   'Acne & Spot Treatment': '#ff6b9d',
//   'Natural & Organic': '#76b041',
//   'Anti-Aging': '#8884d8',
//   'Other': '#999999'
// };

// function formatDate(d: Date) {
//   const yyyy = d.getFullYear();
//   const mm = String(d.getMonth() + 1).padStart(2, '0');
//   const dd = String(d.getDate()).padStart(2, '0');
//   return `${yyyy}-${mm}-${dd}`;
// }

// export const KeywordClustering: React.FC = () => {
//   const [data, setData] = useState<KeywordClusteringData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [view, setView] = useState<'chart' | 'table'>('table');

//   // date filter states
//   const today = new Date();
//   const defaultEnd = formatDate(today);
//   const defaultStart = formatDate(new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000)); // last 28 days

//   const [startDate, setStartDate] = useState<string>(defaultStart);
//   const [endDate, setEndDate] = useState<string>(defaultEnd);
//   const [appliedStart, setAppliedStart] = useState<string>(defaultStart);
//   const [appliedEnd, setAppliedEnd] = useState<string>(defaultEnd);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const params = new URLSearchParams();
//         if (appliedStart) params.append('startDate', appliedStart);
//         if (appliedEnd) params.append('endDate', appliedEnd);
//         const url = `${API_PATHS.keywordClustering}${params.toString() ? `?${params.toString()}` : ''}`;

//         const result: any = await fetchFromAPI(url);

//         // Normalize shapes (support raw array or nested DB driver shapes)
//         let processed = Array.isArray(result) ? result : [];
//         if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
//           processed = result[0];
//         } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
//           processed = result[1].rows;
//         }

//         const normalized: KeywordClusteringData[] = (processed || [])
//           .filter((item: any) => item && (item.cluster_name || item.cluster))
//           .map((item: any) => {
//             const cluster_name = item.cluster_name ?? item.cluster ?? 'Unknown';
//             const total_searches = Number(item.total_searches ?? item.total_searches_count ?? item.total ?? 0);
//             let keywords: Keyword[] | string[] = [];

//             if (Array.isArray(item.keywords)) {
//               keywords = item.keywords.map((k: any) => {
//                 if (typeof k === 'string') return k;
//                 return {
//                   keyword: k.keyword ?? k.search_keyword ?? String(k),
//                   search_count: Number(k.search_count ?? k.count ?? 0)
//                 };
//               });
//             } else {
//               keywords = [];
//             }

//             return { cluster_name, keywords, total_searches };
//           })
//           .sort((a, b) => b.total_searches - a.total_searches);

//         setData(normalized);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch data');
//         setData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [appliedStart, appliedEnd]);

//   const onApply = () => {
//     setAppliedStart(startDate);
//     setAppliedEnd(endDate);
//   };

//   const onReset = () => {
//     setStartDate(defaultStart);
//     setEndDate(defaultEnd);
//     setAppliedStart(defaultStart);
//     setAppliedEnd(defaultEnd);
//   };

//   // prepare chart data (simple bar of total_searches per cluster)
//   const chartData = data.map(d => ({ cluster_name: d.cluster_name, total_searches: d.total_searches }));

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Keyword Clustering</Typography>

//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//             <TextField
//               label="Start"
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//               size="small"
//             />
//             <TextField
//               label="End"
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//               size="small"
//             />
//             <Button variant="outlined" onClick={onApply} size="small">Apply</Button>
//             <Button variant="text" onClick={onReset} size="small">Reset</Button>

//             <ToggleButtonGroup value={view} exclusive onChange={(e, v) => v && setView(v)} size="small">
//               <ToggleButton value="table">Table</ToggleButton>
//               <ToggleButton value="chart">Chart</ToggleButton>
//             </ToggleButtonGroup>
//           </Box>
//         </Box>

//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}

//         {!loading && !error && data.length > 0 && view === 'chart' && (
//           <Box sx={{ width: '100%', height: 420 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 120 }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="cluster_name" angle={-45} textAnchor="end" height={100} interval={0} />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="total_searches" fill="#8884d8" name="Total Searches" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Box>
//         )}

//         {!loading && !error && data.length > 0 && view === 'table' && (
//           <TableContainer component={Paper}>
//             <Table size="small">
//               <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                 <TableRow>
//                   <TableCell><strong>cluster_name</strong></TableCell>
//                   <TableCell><strong>keywords[]</strong></TableCell>
//                   <TableCell align="right"><strong>total_searches</strong></TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {data.map((row, idx) => (
//                   <TableRow key={idx} hover>
//                     <TableCell sx={{ fontWeight: 'bold' }}>{row.cluster_name}</TableCell>
//                     <TableCell>
//                       <Stack direction="row" spacing={0.5} flexWrap="wrap">
//                         {(row.keywords || []).slice(0, 50).map((k: any, i: number) => {
//                           const label = typeof k === 'string' ? k : `${k.keyword}${k.search_count ? ` (${k.search_count})` : ''}`;
//                           return <Chip key={i} label={label} size="small" sx={{ mr: 0.5, mb: 0.5 }} />;
//                         })}
//                         {Array.isArray(row.keywords) && row.keywords.length > 50 && (
//                           <Chip label={`+${row.keywords.length - 50} more`} size="small" />
//                         )}
//                       </Stack>
//                     </TableCell>
//                     <TableCell align="right">{row.total_searches}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}

//         {!loading && !error && data.length === 0 && (
//           <Alert severity="info">No keyword clustering data available for the selected range</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default KeywordClustering;



// frontend/src/components/KeywordClustering.tsx
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  TextField,
  Button,
} from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface Keyword {
  keyword: string;
  search_count: number;
}

interface KeywordClusteringData {
  cluster_name: string;
  keywords: Keyword[] | string[]; // backend may return array of strings or objects
  total_searches: number;
  [key: string]: any;
}

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export const KeywordClustering: React.FC = () => {
  const [data, setData] = useState<KeywordClusteringData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'table' | 'chart'>('table');

  // date filter states (defaults last 28 days)
  const today = new Date();
  const defaultEnd = formatDate(today);
  const defaultStart = formatDate(new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000));

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
        const url = `${API_PATHS.keywordClustering}${params.toString() ? `?${params.toString()}` : ''}`;
        const result: any = await fetchFromAPI(url);

        // Normalize shapes (support flat array, nested array, or DB rows)
        let processed = Array.isArray(result) ? result : [];
        if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
          processed = result[0];
        } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
          processed = result[1].rows;
        }

        const normalized: KeywordClusteringData[] = (processed || [])
          .filter((item: any) => item && (item.cluster_name || item.cluster))
          .map((item: any) => {
            const cluster_name = item.cluster_name ?? item.cluster ?? 'Unknown';
            const total_searches = Number(item.total_searches ?? item.total_search_count ?? item.total ?? 0);

            let keywords: Keyword[] | string[] = [];
            if (Array.isArray(item.keywords)) {
              keywords = item.keywords.map((k: any) => {
                if (typeof k === 'string') {
                  return { keyword: k, search_count: 0 };
                }
                return {
                  keyword: k.keyword ?? k.search_keyword ?? String(k),
                  search_count: Number(k.search_count ?? k.count ?? 0),
                };
              });
            } else if (item.keyword_list && Array.isArray(item.keyword_list)) {
              keywords = item.keyword_list.map((k: any) => (typeof k === 'string' ? { keyword: k, search_count: 0 } : { keyword: k.keyword ?? String(k), search_count: Number(k.count ?? 0) }));
            } else {
              keywords = [];
            }

            return { cluster_name, keywords, total_searches };
          })
          .sort((a, b) => b.total_searches - a.total_searches);

        setData(normalized);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // prepare chart data for optional bar chart (cluster_name, total_searches)
  const chartData = data.map(d => ({ cluster_name: d.cluster_name, total_searches: d.total_searches }));

  // helper to render keywords list
  const renderKeywords = (keywords: Keyword[] | string[]) => {
    if (!Array.isArray(keywords) || keywords.length === 0) return <em style={{ color: '#666' }}>—</em>;
    // show up to first 12 keywords as chips to keep table readable
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {keywords.slice(0, 12).map((k: any, idx: number) => {
          const label = typeof k === 'string' ? k : k.keyword ?? String(k);
          return <Chip key={idx} label={label} size="small" variant="outlined" />;
        })}
        {keywords.length > 12 && <Chip label={`+${keywords.length - 12} more`} size="small" />}
      </Box>
    );
  };

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Keyword Clustering</Typography>

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

            <ToggleButtonGroup value={view} exclusive onChange={(e, v) => v && setView(v)} size="small">
              <ToggleButton value="table">Table</ToggleButton>
              <ToggleButton value="chart">Chart</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && view === 'chart' && (
          <Box sx={{ width: '100%', height: 420 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 120 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="cluster_name" angle={-45} textAnchor="end" height={120} interval={0} />
                <YAxis />
                <ReTooltip />
                <Bar dataKey="total_searches" fill="#8884d8" name="Total Searches" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}

        {!loading && !error && data.length > 0 && view === 'table' && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>cluster_name</strong></TableCell>
                  <TableCell><strong>keywords[]</strong></TableCell>
                  <TableCell align="right"><strong>total_searches</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>{row.cluster_name}</TableCell>
                    <TableCell>{renderKeywords(row.keywords)}</TableCell>
                    <TableCell align="right">{row.total_searches}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No keyword clustering data available for the selected range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordClustering;