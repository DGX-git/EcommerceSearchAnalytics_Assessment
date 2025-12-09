// import React, { useEffect, useState } from 'react';
// import { analyticsAPI } from '../routes/api';

// interface CrossSearchPatternsData {
//   pattern: string;
//   frequency: number;
// }

// export const CrossSearchPatterns: React.FC = () => {
//   const [data, setData] = useState<CrossSearchPatternsData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result:any = await analyticsAPI.getCrossSearchPatterns();
//         setData(result);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="component-container">
//       <h1>Cross Search Patterns</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Pattern</th>
//             <th>Frequency</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.pattern}</td>
//               <td>{item.frequency}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CrossSearchPatterns;



import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';
import { analyticsAPI } from '../routes/api';

interface CrossSearchPatternsData {
  pattern: string;
  frequency: number;
  user_count: number;
}

export const CrossSearchPatterns: React.FC = () => {
  const [data, setData] = useState<CrossSearchPatternsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getCrossSearchPatterns();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ mb: 2 }}>Cross Search Patterns</Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="frequency" type="number" />
                <YAxis dataKey="user_count" type="number" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter name="Cross Search Patterns" data={data} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CrossSearchPatterns;