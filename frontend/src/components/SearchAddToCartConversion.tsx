import React, { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, LinearProgress } from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface SearchAddToCartData {
  keyword: string;
  conversion_rate: number;
  total_searches: number;
  unique_customers: number;
  [key: string]: string | number;
}

export const SearchAddToCartConversion: React.FC = () => {
  const [data, setData] = useState<SearchAddToCartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'area' | 'bar' | 'table'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await fetchFromAPI(API_PATHS.searchAddToCartConversion);
        
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
            conversion_rate: parseFloat(item.conversion_rate),
            total_searches: parseInt(item.total_searches, 10),
            unique_customers: parseInt(item.unique_customers, 10)
          }))
          .sort((a: SearchAddToCartData, b: SearchAddToCartData) => b.conversion_rate - a.conversion_rate)
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

  const avgConversionRate = data.length > 0 
    ? (data.reduce((sum, item) => sum + item.conversion_rate, 0) / data.length).toFixed(2)
    : 0;

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5">Search → Add to Cart Conversion</Typography>
            <Typography variant="caption" color="textSecondary">
              Avg Conversion Rate: {avgConversionRate}%
            </Typography>
          </Box>
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
                    <YAxis label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value) => value + '%'}
                      labelFormatter={(label) => `Keyword: ${label}`}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="conversion_rate" fill="#82ca9d" stroke="#82ca9d" name="Conversion Rate (%)" />
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
                    <YAxis label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value) => value + '%'}
                      labelFormatter={(label) => `Keyword: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="conversion_rate" fill="#82ca9d" name="Conversion Rate (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
            {chartType === 'table' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Keyword</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Conversion Rate</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total Searches</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Unique Customers</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} hover sx={{ backgroundColor: item.conversion_rate > 50 ? '#e8f5e9' : 'inherit' }}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.keyword}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 100 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(item.conversion_rate, 100)}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: '#e0e0e0',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: item.conversion_rate > 50 ? '#4CAF50' : item.conversion_rate > 25 ? '#FFC107' : '#FF6F00'
                                  }
                                }}
                              />
                            </Box>
                            <span>{item.conversion_rate.toFixed(2)}%</span>
                          </Box>
                        </TableCell>
                        <TableCell align="center">{item.total_searches}</TableCell>
                        <TableCell align="center">{item.unique_customers}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No search to cart conversion data available</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchAddToCartConversion;