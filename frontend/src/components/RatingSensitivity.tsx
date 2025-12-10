import React, { useEffect, useState } from 'react';
import {  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, LinearProgress, Rating, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface RatingSensitivityData {
  rating_range: string;
  search_count: number;
  avg_rating: number;
  percentage: number;
  [key: string]: string | number;
}

const COLORS = ['#ff7c7c', '#ffb347', '#90ee90'];

export const RatingSensitivity: React.FC = () => {
  const [data, setData] = useState<RatingSensitivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'table'>('pie');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await fetchFromAPI(API_PATHS.ratingSensitivity);
        
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
          .filter((item: any) => item.rating_range && item.rating_range.trim() !== '')
          .map((item: any) => ({
            rating_range: item.rating_range,
            search_count: parseInt(item.search_count, 10),
            avg_rating: parseFloat(item.avg_rating),
            percentage: parseFloat(item.percentage)
          }));
        
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
    newChartType: 'pie' | 'bar' | 'table',
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  const totalSearches = data.reduce((sum, item) => sum + item.search_count, 0);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Rating Sensitivity</Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
          >
            <ToggleButton value="pie" aria-label="pie chart">
              Pie Chart
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
            {chartType === 'pie' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="search_count"
                      nameKey="rating_range"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      label
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
            {chartType === 'bar' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating_range" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="search_count" fill="#8884d8" name="Search Count" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
            {chartType === 'table' && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Rating Sensitivity</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Search Count</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>% of Total</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avg Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{item.rating_range}</TableCell>
                        <TableCell align="right">{item.search_count}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 60 }}>
                              <LinearProgress
                                variant="determinate"
                                value={item.percentage}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: '#e0e0e0',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: COLORS[index % COLORS.length]
                                  }
                                }}
                              />
                            </Box>
                            <span>{item.percentage.toFixed(1)}%</span>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Rating value={item.avg_rating} max={5} readOnly precision={0.5} size="small" />
                          <Typography variant="caption">{item.avg_rating.toFixed(2)}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        )}
        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No rating sensitivity data available</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingSensitivity;