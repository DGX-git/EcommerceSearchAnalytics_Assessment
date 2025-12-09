// import React, { useEffect, useState } from 'react';
// import { analyticsAPI } from '../routes/api';

// interface RatingSensitivityData {
//   rating_range: string;
//   sensitivity: number;
// }

// export const RatingSensitivity: React.FC = () => {
//   const [data, setData] = useState<RatingSensitivityData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result:any = await analyticsAPI.getRatingSensitivity();
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
//       <h1>Rating Sensitivity</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Rating Range</th>
//             <th>Sensitivity</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.rating_range}</td>
//               <td>{item.sensitivity}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default RatingSensitivity;



import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';
import { analyticsAPI } from '../routes/api';

interface RatingSensitivityData {
  rating_range: string;
  count: number;
  [key: string]: string | number; // Add this for Recharts compatibility
}

const COLORS = ['#ff7c7c', '#ffb347', '#ffd700', '#90ee90', '#87ceeb', '#dda0dd'];

export const RatingSensitivity: React.FC = () => {
  const [data, setData] = useState<RatingSensitivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getRatingSensitivity();
        const chartData = Array.isArray(result) ? result : [result];
        setData(chartData as RatingSensitivityData[]);
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
        <Typography variant="h5" sx={{ mb: 2 }}>Rating Sensitivity</Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="count" nameKey="rating_range" cx="50%" cy="50%" outerRadius={100} label>
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
      </CardContent>
    </Card>
  );
};

export default RatingSensitivity;