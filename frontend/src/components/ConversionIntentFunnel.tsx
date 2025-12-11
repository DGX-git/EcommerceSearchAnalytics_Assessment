// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, ToggleButton, ToggleButtonGroup, LinearProgress } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface FunnelStageData {
//   stage: string;
//   count: number;
//   percentage: number;
// }

// export const ConversionIntentFunnel: React.FC = () => {
//   const [data, setData] = useState<FunnelStageData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'bar' | 'line' | 'table'>('bar');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.conversionIntentFunnel);
        
//         let processedData = Array.isArray(result) ? result : [];
//         if (Array.isArray(result) && result.length > 0 && result[0] && Array.isArray(result[0])) {
//           processedData = result[0];
//         } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
//           processedData = result[1].rows;
//         }
        
//         setData(processedData.filter((item: FunnelStageData) => item && item.stage));
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const COLORS = ['#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Conversion Intent Funnel</Typography>
//           <ToggleButtonGroup value={chartType} exclusive onChange={(e, newType) => newType && setChartType(newType)}>
//             <ToggleButton value="bar">Bar</ToggleButton>
//             <ToggleButton value="line">Line</ToggleButton>
//             <ToggleButton value="table">Table</ToggleButton>
//           </ToggleButtonGroup>
//         </Box>
        
//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
        
//         {!loading && !error && data.length > 0 && (
//           <Box>
//             {chartType === 'bar' && (
//               <ResponsiveContainer width="100%" height={400}>
//                 <BarChart data={data}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="stage" />
//                   <YAxis yAxisId="left" label={{ value: 'Search Count', angle: -90, position: 'insideLeft' }} />
//                   <YAxis yAxisId="right" orientation="right" label={{ value: 'Conversion %', angle: 90, position: 'insideRight' }} />
//                   <Tooltip />
//                   <Legend />
//                   <Bar yAxisId="left" dataKey="count" fill="#8884D8" name="Search Count" />
//                   <Bar yAxisId="right" dataKey="percentage" fill="#82CA9D" name="Conversion %" />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
            
//             {chartType === 'line' && (
//               <ResponsiveContainer width="100%" height={400}>
//                 <LineChart data={data}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="stage" />
//                   <YAxis yAxisId="left" label={{ value: 'Search Count', angle: -90, position: 'insideLeft' }} />
//                   <YAxis yAxisId="right" orientation="right" label={{ value: 'Conversion %', angle: 90, position: 'insideRight' }} />
//                   <Tooltip />
//                   <Legend />
//                   <Line yAxisId="left" type="monotone" dataKey="count" stroke="#8884D8" name="Search Count" />
//                   <Line yAxisId="right" type="monotone" dataKey="percentage" stroke="#82CA9D" name="Conversion %" />
//                 </LineChart>
//               </ResponsiveContainer>
//             )}
            
//             {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                     <TableRow>
//                       <TableCell><strong>Funnel Stage</strong></TableCell>
//                       <TableCell align="right"><strong>Search Count</strong></TableCell>
//                       <TableCell align="right"><strong>Conversion %</strong></TableCell>
//                       <TableCell><strong>Progress</strong></TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((row, index) => (
//                       <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
//                         <TableCell sx={{ fontWeight: 'bold' }}>{row.stage}</TableCell>
//                         <TableCell align="right">{row.count.toLocaleString()}</TableCell>
//                         <TableCell align="right" sx={{ color: row.percentage > 50 ? '#388e3c' : '#d32f2f', fontWeight: 'bold' }}>
//                           {row.percentage}%
//                         </TableCell>
//                         <TableCell>
//                           <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <LinearProgress 
//                               variant="determinate" 
//                               value={row.percentage}
//                               sx={{ 
//                                 flex: 1,
//                                 backgroundColor: '#e0e0e0',
//                                 '& .MuiLinearProgress-bar': {
//                                   backgroundColor: row.percentage > 50 ? '#4caf50' : row.percentage > 25 ? '#ff9800' : '#f44336'
//                                 }
//                               }}
//                             />
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
            
//             <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
//               <Typography variant="body2" sx={{ mb: 1 }}>
//                 <strong>Funnel Analysis:</strong>
//               </Typography>
//               <Typography variant="body2">
//                 • <strong>Search:</strong> Total search instances in the platform
//               </Typography>
//               <Typography variant="body2">
//                 • <strong>Product View:</strong> Searches that returned products (total_results &gt; 0)
//               </Typography>
//               <Typography variant="body2">
//                 • <strong>Add to Cart:</strong> Searches with good product availability, pricing, and ratings (rating ≥ 3)
//               </Typography>
//               <Typography variant="body2">
//                 • <strong>Purchase Intent:</strong> Repeat searches by engaged customers (3+ searches), indicating high purchase likelihood
//               </Typography>
//             </Box>
//           </Box>
//         )}
        
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="info">No conversion funnel data available</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default ConversionIntentFunnel;


// frontend/src/components/ConversionIntentFunnel.tsx
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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
  TextField,
  Button,
} from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

type AggregateRow = { stage: string; count: number; user_count?: number };
type KeywordRow = { keyword: string; searches: number; views: number; add_to_cart: number; purchases: number; unique_users?: number };

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const STAGE_COLORS = ['#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

const ConversionIntentFunnel: React.FC = () => {
  const [aggregate, setAggregate] = useState<AggregateRow[]>([]);
  const [keywordFunnel, setKeywordFunnel] = useState<KeywordRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // view toggles
  const [chartType, setChartType] = useState<'chart' | 'table'>('chart');
  const [tableMode, setTableMode] = useState<'stage' | 'keyword'>('stage');

  // date filter
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
        const url = `${API_PATHS.conversionIntentFunnel}${params.toString() ? `?${params.toString()}` : ''}`;

        const result: any = await fetchFromAPI(url);

        // The backend may return:
        // { aggregateFunnel: [...], keywordFunnel: [...] } OR just an array of stages
        let aggregateRows: AggregateRow[] = [];
        let keywords: KeywordRow[] = [];

        if (result) {
          if (result.aggregateFunnel && Array.isArray(result.aggregateFunnel)) {
            aggregateRows = result.aggregateFunnel.map((r: any) => ({
              stage: String(r.stage),
              count: Number(r.count ?? 0),
              user_count: Number(r.user_count ?? 0),
            }));
          } else if (Array.isArray(result) && result.length > 0 && result[0] && (result[0].stage || result[0].count !== undefined)) {
            aggregateRows = result.map((r: any) => ({
              stage: String(r.stage),
              count: Number(r.count ?? 0),
              user_count: Number(r.user_count ?? 0),
            }));
          }

          if (result.keywordFunnel && Array.isArray(result.keywordFunnel)) {
            keywords = result.keywordFunnel.map((r: any) => ({
              keyword: r.keyword ?? '',
              searches: Number(r.searches ?? 0),
              views: Number(r.views ?? 0),
              add_to_cart: Number(r.add_to_cart ?? 0),
              purchases: Number(r.purchases ?? 0),
              unique_users: Number(r.unique_users ?? 0),
            }));
          } else if (Array.isArray(result.keywordFunnel)) {
            // already handled
          } else if (Array.isArray(result) && result.length > 0 && result[0] && result[0].keyword) {
            // fallback shape
            keywords = result as KeywordRow[];
          }
        }

        setAggregate(aggregateRows);
        setKeywordFunnel(keywords);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setAggregate([]);
        setKeywordFunnel([]);
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

  // Chart data: ensure order Search → Product View → Add to Cart → Purchase
  const stageOrder = ['Search', 'Product View', 'Add to Cart', 'Purchase'];
  const chartData = stageOrder.map((s, idx) => {
    const row = aggregate.find(a => a.stage.toLowerCase() === s.toLowerCase());
    return { stage: s, count: row ? row.count : 0, color: STAGE_COLORS[idx % STAGE_COLORS.length] };
  });

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Conversion Intent Funnel</Typography>

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

            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(e, newType) => newType && setChartType(newType)}
              size="small"
            >
              <ToggleButton value="chart">Chart</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>

            {chartType === 'table' && (
              <ToggleButtonGroup
                value={tableMode}
                exclusive
                onChange={(e, newMode) => newMode && setTableMode(newMode)}
                size="small"
              >
                <ToggleButton value="stage">Stage Table</ToggleButton>
                <ToggleButton value="keyword">Keyword Table</ToggleButton>
              </ToggleButtonGroup>
            )}
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && (
          <>
            {chartType === 'chart' && (
              <Box sx={{ width: '100%', height: 420 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Count">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {chartType === 'table' && tableMode === 'stage' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><strong>stage</strong></TableCell>
                      <TableCell align="right"><strong>user_count</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {aggregate.length === 0 && (
                      stageOrder.map((s) => (
                        <TableRow key={s}>
                          <TableCell>{s}</TableCell>
                          <TableCell align="right">0</TableCell>
                        </TableRow>
                      ))
                    )}
                    {aggregate.length > 0 && stageOrder.map((s) => {
                      const row = aggregate.find(a => a.stage.toLowerCase() === s.toLowerCase());
                      return (
                        <TableRow key={s} hover>
                          <TableCell sx={{ fontWeight: 'bold' }}>{s}</TableCell>
                          <TableCell align="right">{row?.user_count ?? row?.count ?? 0}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {chartType === 'table' && tableMode === 'keyword' && (
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell><strong>keyword</strong></TableCell>
                      <TableCell align="right"><strong>searches</strong></TableCell>
                      <TableCell align="right"><strong>views</strong></TableCell>
                      <TableCell align="right"><strong>add_to_cart</strong></TableCell>
                      <TableCell align="right"><strong>purchases</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {keywordFunnel.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">No keyword funnel data available for the selected range</TableCell>
                      </TableRow>
                    )}
                    {keywordFunnel.map((k, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>{k.keyword}</TableCell>
                        <TableCell align="right">{k.searches}</TableCell>
                        <TableCell align="right">{k.views}</TableCell>
                        <TableCell align="right">{k.add_to_cart}</TableCell>
                        <TableCell align="right">{k.purchases}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}

        {!loading && !error && aggregate.length === 0 && keywordFunnel.length === 0 && (
          <Alert severity="info">No conversion funnel data available for the selected range</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversionIntentFunnel;