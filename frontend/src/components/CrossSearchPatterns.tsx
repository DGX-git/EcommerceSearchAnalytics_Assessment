// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
// import { Box, CircularProgress, Alert, Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, ToggleButton, ToggleButtonGroup, Chip, Stack } from '@mui/material';
// import { fetchFromAPI } from '../utils';
// import { API_PATHS } from '../constants';

// interface CrossSearchPatternData {
//   pattern: string;
//   frequency: number;
//   user_count: number;
//   pattern_percentage: number;
// }

// export const CrossSearchPatterns: React.FC = () => {
//   const [data, setData] = useState<CrossSearchPatternData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<'bar' | 'scatter' | 'table'>('bar');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.crossSearchPatterns);
        
//         let processedData = Array.isArray(result) ? result : [];
//         if (Array.isArray(result) && result.length > 0 && result[0] && Array.isArray(result[0])) {
//           processedData = result[0];
//         } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
//           processedData = result[1].rows;
//         }
        
//         setData(processedData.filter((item: CrossSearchPatternData) => item && item.pattern));
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const chartData = data.map(item => ({
//     name: item.pattern,
//     frequency: item.frequency,
//     user_count: item.user_count,
//     percentage: item.pattern_percentage
//   }));

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//           <Typography variant="h5">Cross-Search Patterns</Typography>
//           <ToggleButtonGroup value={chartType} exclusive onChange={(e, newType) => newType && setChartType(newType)}>
//             <ToggleButton value="bar">Bar</ToggleButton>
//             <ToggleButton value="scatter">Scatter</ToggleButton>
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
//                   <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} interval={0} />
//                   <YAxis yAxisId="left" label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
//                   <YAxis yAxisId="right" orientation="right" label={{ value: 'User Count', angle: 90, position: 'insideRight' }} />
//                   <Tooltip />
//                   <Legend />
//                   <Bar yAxisId="left" dataKey="frequency" fill="#8884d8" name="Pattern Frequency" />
//                   <Bar yAxisId="right" dataKey="user_count" fill="#82ca9d" name="Unique Users" />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
            
//             {chartType === 'scatter' && (
//               <ResponsiveContainer width="100%" height={400}>
//                 <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis 
//                     dataKey="frequency" 
//                     type="number"
//                     label={{ value: 'Pattern Frequency', position: 'insideBottomRight', offset: -10 }}
//                   />
//                   <YAxis 
//                     dataKey="user_count"
//                     type="number"
//                     label={{ value: 'Unique Users', angle: -90, position: 'insideLeft' }}
//                   />
//                   <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//                   <Legend />
//                   <Scatter 
//                     name="Cross-Search Patterns" 
//                     data={chartData} 
//                     fill="#8884d8"
//                   />
//                 </ScatterChart>
//               </ResponsiveContainer>
//             )}
            
//             {chartType === 'table' && (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
//                     <TableRow>
//                       <TableCell><strong>Search Pattern (First → Next)</strong></TableCell>
//                       <TableCell align="right"><strong>Frequency</strong></TableCell>
//                       <TableCell align="right"><strong>Unique Users</strong></TableCell>
//                       <TableCell align="right"><strong>Pattern %</strong></TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((row, index) => {
//                       const [firstKeyword, nextKeyword] = row.pattern.split(' → ');
//                       return (
//                         <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
//                           <TableCell>
//                             <Stack direction="row" spacing={1} alignItems="center">
//                               <Chip label={firstKeyword} size="small" variant="outlined" />
//                               <Typography variant="body2">→</Typography>
//                               <Chip label={nextKeyword} size="small" color="primary" />
//                             </Stack>
//                           </TableCell>
//                           <TableCell align="right" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
//                             {row.frequency}
//                           </TableCell>
//                           <TableCell align="right">{row.user_count}</TableCell>
//                           <TableCell align="right" sx={{ color: '#388e3c', fontWeight: 'bold' }}>
//                             {row.pattern_percentage}%
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
            
//             <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
//               <Typography variant="body2" sx={{ mb: 1 }}>
//                 <strong>Pattern Insights:</strong>
//               </Typography>
//               <Typography variant="body2">
//                 • Shows search sequences where customers searched one keyword followed by another within 7 days
//               </Typography>
//               <Typography variant="body2">
//                 • Example: "serum" → "vitamin C" indicates users searching for serum often search for vitamin C next
//               </Typography>
//               <Typography variant="body2">
//                 • Frequency: Number of times this pattern occurred across all customers
//               </Typography>
//               <Typography variant="body2">
//                 • Unique Users: Count of distinct customers who exhibited this pattern
//               </Typography>
//               <Typography variant="body2">
//                 • Pattern %: Percentage of total searches this pattern represents
//               </Typography>
//             </Box>
//           </Box>
//         )}
        
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="info">No cross-search patterns found</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default CrossSearchPatterns;






// frontend/src/components/CrossSearchPatterns.tsx
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
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  Button,
  Stack,
  Chip
} from '@mui/material';
import { ResponsiveContainer, Sankey, Tooltip as ReTooltip } from 'recharts';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface CrossSearchPatternData {
  pattern: string; // e.g. "serum → vitamin C"
  frequency: number;
  user_count: number;
  pattern_percentage: number;
}

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const nodeColors = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5'];

const CrossSearchPatterns: React.FC = () => {
  const [data, setData] = useState<CrossSearchPatternData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'sankey' | 'table'>('sankey');

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
        const url = `${API_PATHS.crossSearchPatterns}${params.toString() ? `?${params.toString()}` : ''}`;

        const result: any = await fetchFromAPI(url);

        let processedData = Array.isArray(result) ? result : [];
        if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
          processedData = result[0];
        } else if (Array.isArray(result) && result.length > 1 && result[1] && result[1].rows) {
          processedData = result[1].rows;
        }

        const normalized: CrossSearchPatternData[] = processedData
          .filter((r: any) => r && (r.pattern || (r.from_keyword && r.to_keyword)))
          .map((r: any) => {
            // If backend returned separate from/to, support both shapes
            if (r.from_keyword && r.to_keyword) {
              return {
                pattern: `${r.from_keyword} → ${r.to_keyword}`,
                frequency: Number(r.frequency ?? r.count ?? 0),
                user_count: Number(r.user_count ?? 0),
                pattern_percentage: Number(r.pattern_percentage ?? 0),
              };
            }
            return {
              pattern: String(r.pattern),
              frequency: Number(r.frequency ?? 0),
              user_count: Number(r.user_count ?? 0),
              pattern_percentage: Number(r.pattern_percentage ?? 0),
            };
          });

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

  // Build Sankey nodes/links from patterns
  const { nodes, links } = React.useMemo(() => {
    const nodeIndex = new Map<string, number>();
    const nodeList: { name: string }[] = [];
    const linkList: { source: number; target: number; value: number }[] = [];

    function ensureNode(name: string) {
      if (!nodeIndex.has(name)) {
        nodeIndex.set(name, nodeList.length);
        nodeList.push({ name });
      }
      return nodeIndex.get(name)!;
    }

    data.forEach(item => {
      // split pattern robustly on arrow characters
      let from = '';
      let to = '';
      if (item.pattern.includes('→')) {
        const parts = item.pattern.split('→').map(p => p.trim());
        from = parts[0] ?? '';
        to = parts[1] ?? '';
      } else if (item.pattern.includes('->')) {
        const parts = item.pattern.split('->').map(p => p.trim());
        from = parts[0] ?? '';
        to = parts[1] ?? '';
      } else {
        // fallback: split by space then next word (best-effort)
        const parts = item.pattern.split(/\s+/);
        from = parts[0] ?? '';
        to = parts.slice(1).join(' ') ?? '';
      }

      if (!from || !to) return;

      const s = ensureNode(from);
      const t = ensureNode(to);

      // choose value: use user_count (shows distinct users transitioning)
      const value = Number(item.user_count ?? item.frequency ?? 0) || 0;

      // aggregate links if duplicate
      const existing = linkList.find(l => l.source === s && l.target === t);
      if (existing) {
        existing.value += value;
      } else {
        linkList.push({ source: s, target: t, value });
      }
    });

    // convert nodeList into the shape Recharts Sankey expects (name)
    return { nodes: nodeList, links: linkList };
  }, [data]);

  // table rows: from_keyword | to_keyword | user_count
  const tableRows = data.map(d => {
    // parse pattern as above
    let from = '';
    let to = '';
    if (d.pattern.includes('→')) {
      const parts = d.pattern.split('→').map(p => p.trim());
      from = parts[0] ?? '';
      to = parts[1] ?? '';
    } else if (d.pattern.includes('->')) {
      const parts = d.pattern.split('->').map(p => p.trim());
      from = parts[0] ?? '';
      to = parts[1] ?? '';
    } else {
      const parts = d.pattern.split(/\s+/);
      from = parts[0] ?? '';
      to = parts.slice(1).join(' ') ?? '';
    }
    return { from_keyword: from, to_keyword: to, user_count: Number(d.user_count ?? d.frequency ?? 0) };
  });

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Cross-Search Patterns</Typography>

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
              <ToggleButton value="sankey">Sankey</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && view === 'sankey' && (
          <Box sx={{ width: '100%', height: 520 }}>
            <ResponsiveContainer width="100%" height="100%">
              <Sankey
                data={{ nodes, links }}
                nodePadding={10}
                nodeWidth={12}
                link={{ stroke: '#77aadd' }}
                iterations={32}
              >
                <ReTooltip />
              </Sankey>
            </ResponsiveContainer>
          </Box>
        )}

        {!loading && !error && data.length > 0 && view === 'table' && (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>from_keyword</strong></TableCell>
                  <TableCell><strong>to_keyword</strong></TableCell>
                  <TableCell align="right"><strong>user_count</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{row.from_keyword}</TableCell>
                    <TableCell>{row.to_keyword}</TableCell>
                    <TableCell align="right">{row.user_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No cross-search patterns found for the selected range</Alert>
        )}

        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}><strong>Pattern Insights:</strong></Typography>
          <Typography variant="body2">• Shows search sequences where customers searched one keyword followed by another (within a short window).</Typography>
          <Typography variant="body2">• Table columns: <code>from_keyword | to_keyword | user_count</code>.</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CrossSearchPatterns;