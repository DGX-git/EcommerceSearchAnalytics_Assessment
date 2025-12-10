import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Chip } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface TrendingKeywordData {
  keyword: string;
  wow_change: string;
  current_volume?: number;
  previous_volume?: number;
  [key: string]: string | number | undefined;
}

export const TrendingKeywords: React.FC = () => {
  const [data, setData] = useState<TrendingKeywordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'table'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await fetchFromAPI(API_PATHS.trendingKeywords);
        
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
            wow_change: item.wow_change,
            current_volume: item.current_volume,
            previous_volume: item.previous_volume
          }))
          .slice(0, 15);
        
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
    newChartType: 'bar' | 'table',
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  // Prepare data for chart (extract numeric value from percentage string)
  const chartData = data.map(item => ({
    keyword: item.keyword,
    wow_change: parseFloat(item.wow_change as string),
    wow_change_label: item.wow_change
  }));

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon sx={{ color: '#82ca9d' }} />
            <Typography variant="h5">Trending Keywords (WoW Change)</Typography>
          </Box>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
          >
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
            {chartType === 'bar' && (
              <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: 'WoW Change (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value: any) => value.toFixed(2) + '%'}
                      labelFormatter={(label) => `Keyword: ${label}`}
                    />
                    <Legend />
                    <Bar dataKey="wow_change" fill="#82ca9d" name="WoW Change (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
            
          </>
        )}
        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No trending keywords with positive growth this week</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendingKeywords;