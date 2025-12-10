import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface LowResultSearchesData {
  keyword: string;
  avg_result_count: number;
  search_count: number;
  min_results: number;
  max_results: number;
  [key: string]: string | number;
}

export const LowResultSearches: React.FC = () => {
  const [data, setData] = useState<LowResultSearchesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'area' | 'bar' | 'table'>('area');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await fetchFromAPI(API_PATHS.lowResultSearches);
        
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
            avg_result_count: parseFloat(item.avg_result_count),
            search_count: parseInt(item.search_count, 10),
            min_results: parseInt(item.min_results, 10),
            max_results: parseInt(item.max_results, 10)
          }))
          .sort((a: LowResultSearchesData, b: LowResultSearchesData) => a.avg_result_count - b.avg_result_count)
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
          <Typography variant="h5">Low-Result Searches (Less than 5 products)</Typography>
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
                    <YAxis />
                    <Tooltip formatter={(value) => value} />
                    <Legend />
                    <Area type="monotone" dataKey="avg_result_count" fill="#ffc658" stroke="#ffc658" name="Avg Result Count" />
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
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avg_result_count" fill="#ffc658" name="Avg Result Count" />
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
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Avg Results</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Min Results</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Max Results</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} hover sx={{ backgroundColor: item.avg_result_count < 2 ? '#fff3cd' : 'inherit' }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.keyword}</TableCell>
                        <TableCell align="right">{item.avg_result_count.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.min_results}</TableCell>
                        <TableCell align="right">{item.max_results}</TableCell>
                        <TableCell align="right">{item.search_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )} */}
          </>
        )}
        {!loading && !error && data.length === 0 && (
          <Alert severity="success">No low-result searches found. Great catalog coverage!</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default LowResultSearches;