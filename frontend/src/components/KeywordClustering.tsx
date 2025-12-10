import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Table, Chip, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,  Accordion, AccordionSummary, AccordionDetails, LinearProgress } from '@mui/material';
import { fetchFromAPI } from '../utils';
import { API_PATHS } from '../constants';

interface Keyword {
  keyword: string;
  search_count: number;
}

interface KeywordClusteringData {
  cluster_name: string;
  keywords: Keyword[];
  total_searches: number;
  [key: string]: string | number | Keyword[];
}

const CLUSTER_COLORS: Record<string, string> = {
  'Face Moisturizers': '#8884d8',
  'Sunscreen & SPF': '#ffc658',
  'Face Cleansers': '#82ca9d',
  'Serums & Treatments': '#d084d0',
  'Lip Care': '#ff7c7c',
  'Eye Care': '#00c49f',
  'Masks & Exfoliants': '#ffb028',
  'Acne & Spot Treatment': '#ff6b9d',
  'Natural & Organic': '#76b041',
  'Anti-Aging': '#8884d8',
  'Other': '#999999'
};

export const KeywordClustering: React.FC = () => {
  const [data, setData] = useState<KeywordClusteringData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'table'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await fetchFromAPI(API_PATHS.keywordClustering);
        
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
          .filter((item: any) => item.cluster_name && item.keywords && item.keywords.length > 0)
          .map((item: any) => ({
            cluster_name: item.cluster_name,
            keywords: Array.isArray(item.keywords) 
              ? item.keywords.map((k: any) => ({
                  keyword: typeof k === 'string' ? k : k.keyword,
                  search_count: typeof k === 'string' ? 0 : k.search_count
                }))
              : [],
            total_searches: parseInt(item.total_searches, 10)
          }))
          .sort((a: KeywordClusteringData, b: KeywordClusteringData) => 
  (b.total_searches as number) - (a.total_searches as number)
);
        
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

  const chartData = data.map(item => ({
    cluster_name: item.cluster_name,
    total_searches: item.total_searches
  }));

  // const totalSearches = data.reduce((sum, item) => sum + parseInt(item.total_searches as string, 10), 0);

  const totalSearches = data.reduce((sum, item) => sum + (item.total_searches as number), 0);


  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Keyword Clustering</Typography>
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
              Details
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
                    <XAxis dataKey="cluster_name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total_searches" fill="#8884d8" name="Total Searches" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
            {chartType === 'table' && (
              <Box>
                {data.map((cluster, index) => (
                  <Accordion key={index} defaultExpanded={index === 0}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            backgroundColor: CLUSTER_COLORS[cluster.cluster_name] || '#999',
                            borderRadius: '2px'
                          }}
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', flex: 1 }}>
                          {cluster.cluster_name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Typography variant="caption" color="textSecondary">
                            {(cluster.keywords as Keyword[]).length} keywords
                          </Typography>
                          <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                            {cluster.total_searches} searches
                          </Typography>
                          <Box sx={{ width: 100 }}>
                            <LinearProgress
                              variant="determinate"
                              // value={(parseInt(cluster.total_searches as string, 10) / totalSearches) * 100}
                              value={((cluster.total_searches as number) / totalSearches) * 100}
                              
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: CLUSTER_COLORS[cluster.cluster_name] || '#999'
                                }
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {(cluster.keywords as Keyword[]).map((kw, idx) => (
                          <Chip
                            key={idx}
                            label={`${kw.keyword} (${kw.search_count})`}
                            variant="outlined"
                            size="small"
                            sx={{
                              borderColor: CLUSTER_COLORS[cluster.cluster_name] || '#999',
                              color: CLUSTER_COLORS[cluster.cluster_name] || '#999'
                            }}
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </>
        )}
        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No keyword clustering data available</Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default KeywordClustering;