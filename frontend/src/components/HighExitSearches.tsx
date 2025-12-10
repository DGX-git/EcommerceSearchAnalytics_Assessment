import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface HighExitSearchesData {
  keyword: string;
  exit_rate: number;
  total_searches: number;
  zero_result_searches: number;
  low_result_searches: number;
  [key: string]: string | number;
}

export const HighExitSearches: React.FC = () => {
  const [data, setData] = useState<HighExitSearchesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'area' | 'bar' | 'table'>('area');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await fetchFromAPI(API_PATHS.highExitSearches);
        
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
          .filter((item: any) => item.keyword && item.keyword.trim() !== '')
          .map((item: any) => ({
            keyword: item.keyword,
            exit_rate: parseFloat(item.exit_rate),
            total_searches: parseInt(item.total_searches, 10),
            zero_result_searches: parseInt(item.zero_result_searches, 10),
            low_result_searches: parseInt(item.low_result_searches, 10)
          }))
          .sort((a: HighExitSearchesData, b: HighExitSearchesData) => b.exit_rate - a.exit_rate)
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
    newChartType: 'area' | 'bar' | 'table',
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">High-Exit Searches</Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
          >
            <ToggleButton value="area" aria-label="area chart">
              Area Chart
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
            {chartType === 'area' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: 'Exit Rate (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value) => value + '%'}
                      labelFormatter={(label) => `Keyword: ${label}`}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="exit_rate" fill="#ff7300" stroke="#ff7300" name="Exit Rate (%)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            )}
            {chartType === 'bar' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: 'Exit Rate (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value) => value + '%'}
                      labelFormatter={(label) => `Keyword: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="exit_rate" fill="#ff7300" name="Exit Rate (%)" />
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
                      <TableCell sx={{ fontWeight: 'bold' }}>Keyword</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Exit Rate</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Searches</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Zero Results</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Low Results (&lt;5)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} hover sx={{ backgroundColor: item.exit_rate > 50 ? '#ffebee' : 'inherit' }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.keyword}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={item.exit_rate.toFixed(2) + '%'}
                            color={item.exit_rate > 75 ? 'error' : item.exit_rate > 50 ? 'warning' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{item.total_searches}</TableCell>
                        <TableCell align="right">{item.zero_result_searches}</TableCell>
                        <TableCell align="right">{item.low_result_searches}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )} */}
          </>
        )}
        {!loading && !error && data.length === 0 && (
          <Alert severity="success">No high-exit searches detected. User engagement is good!</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default HighExitSearches;