// import React, { useEffect, useState } from 'react';
// import { analyticsAPI } from '../routes/api';

// interface ConversionFunnelData {
//   stage: string;
//   count: number;
// }

// export const ConversionIntentFunnel: React.FC = () => {
//   const [data, setData] = useState<ConversionFunnelData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result:any = await analyticsAPI.getConversionIntentFunnel();
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
//       <h1>Conversion Intent Funnel</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>Stage</th>
//             <th>Count</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index}>
//               <td>{item.stage}</td>
//               <td>{item.count}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ConversionIntentFunnel;




import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress, Alert, Card, CardContent, Typography } from '@mui/material';
import { analyticsAPI } from '../routes/api';

interface ConversionFunnelData {
  stage: string;
  count: number;
  [key: string]: string | number; // Add this for Recharts compatibility
}

const COLORS = ['#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#0088FE', '#00C49F'];

export const ConversionIntentFunnel: React.FC = () => {
  const [data, setData] = useState<ConversionFunnelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: any = await analyticsAPI.getConversionIntentFunnel();
        const chartData = Array.isArray(result) ? result : [result];
        setData(chartData as ConversionFunnelData[]);
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
        <Typography variant="h5" sx={{ mb: 2 }}>Conversion Intent Funnel</Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && (
          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="count" nameKey="stage" cx="50%" cy="50%" outerRadius={100} label>
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

export default ConversionIntentFunnel;