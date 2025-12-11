// import React, { useEffect, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
// } from "recharts";
// import {
//   Box,
//   CircularProgress,
//   Alert,
//   Card,
//   CardContent,
//   Typography,
//   ToggleButton,
//   ToggleButtonGroup,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
// } from "@mui/material";
// import { fetchFromAPI } from "../utils";
// import { API_PATHS } from "../constants";

// interface TopSearchVolumeData {
//   keyword: string;
//   search_volume: number;
//   [key: string]: string | number;
// }

// export const TopSearchVolume: React.FC = () => {
//   const [data, setData] = useState<TopSearchVolumeData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [chartType, setChartType] = useState<"bar" | "pie" | "table">("bar");

//   const COLORS = [
//     "#8884d8",
//     "#82ca9d",
//     "#ffc658",
//     "#ff7c7c",
//     "#8dd1e1",
//     "#d084d0",
//     "#82d982",
//     "#ffa500",
//     "#00c49f",
//     "#ffbb28",
//   ];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const result: any = await fetchFromAPI(API_PATHS.topSearchVolume);

//         // Handle both array and nested array responses
//         let processedData = Array.isArray(result) ? result : [];

//         // If result is an array with metadata object, extract the data array
//         if (
//           Array.isArray(result) &&
//           result.length > 0 &&
//           result[0] &&
//           Array.isArray(result[0])
//         ) {
//           processedData = result[0];
//         } else if (
//           Array.isArray(result) &&
//           result.length > 1 &&
//           result[1] &&
//           result[1].rows
//         ) {
//           processedData = result[1].rows;
//         }

//         // Filter out null keywords and convert search_volume to number
//         const filteredData = processedData
//           .filter((item: any) => item.keyword && item.keyword.trim() !== "")
//           .map((item: any) => ({
//             keyword: item.keyword,
//             search_volume: parseInt(item.search_volume, 10),
//           }))
//           .sort(
//             (a: TopSearchVolumeData, b: TopSearchVolumeData) =>
//               b.search_volume - a.search_volume
//           )
//           .slice(0, 15);

//         setData(filteredData);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleChartTypeChange = (
//     event: React.MouseEvent<HTMLElement>,
//     newChartType: "bar" | "pie" | "table"
//   ) => {
//     if (newChartType !== null) {
//       setChartType(newChartType);
//     }
//   };

//   return (
//     <Card sx={{ m: 2 }}>
//       <CardContent>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             mb: 2,
//           }}
//         >
//           <Typography variant="h5">Top Search Volume (Weekly)</Typography>
//           <ToggleButtonGroup
//             value={chartType}
//             exclusive
//             onChange={handleChartTypeChange}
//             aria-label="chart type"
//           >
//             <ToggleButton value="bar" aria-label="bar chart">
//               Bar Chart
//             </ToggleButton>
//             <ToggleButton value="pie" aria-label="pie chart">
//               Pie Chart
//             </ToggleButton>
//             <ToggleButton value="table" aria-label="table">
//               Table
//             </ToggleButton>
//           </ToggleButtonGroup>
//         </Box>

//         {loading && <CircularProgress />}
//         {error && <Alert severity="error">{error}</Alert>}
//         {!loading && !error && data.length > 0 && (
//           <>
//             {chartType === "bar" && (
//               <Box sx={{ width: "100%", height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={data}
//                     margin={{ top: 20, right: 30, left: 0, bottom: 100 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis
//                       dataKey="keyword"
//                       angle={-45}
//                       textAnchor="end"
//                       height={100}
//                     />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar
//                       dataKey="search_volume"
//                       fill="#8884d8"
//                       name="Search Volume"
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === "pie" && (
//               <Box sx={{ width: "100%", height: 400 }}>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={data}
//                       dataKey="search_volume"
//                       nameKey="keyword"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={120}
//                       label
//                     >
//                       {data.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </Box>
//             )}
//             {chartType === "table" && (
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                     <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//                       <TableCell sx={{ fontWeight: "bold" }}>Rank</TableCell>
//                       <TableCell sx={{ fontWeight: "bold" }}>Keyword</TableCell>
//                       <TableCell align="right" sx={{ fontWeight: "bold" }}>
//                         Search Volume
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {data.map((item, index) => (
//                       <TableRow key={index} hover>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{item.keyword}</TableCell>
//                         <TableCell align="right">
//                           {item.search_volume}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             )}
//           </>
//         )}
//         {!loading && !error && data.length === 0 && (
//           <Alert severity="info">No search data available for this week</Alert>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default TopSearchVolume;




import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import { fetchFromAPI } from "../utils";
import { API_PATHS } from "../constants";

interface TopSearchVolumeData {
  keyword: string;
  search_volume: number;
  [key: string]: string | number;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7c7c",
  "#8dd1e1",
  "#d084d0",
  "#82d982",
  "#ffa500",
  "#00c49f",
  "#ffbb28",
];

function formatDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const TopSearchVolume: React.FC = () => {
  const [data, setData] = useState<TopSearchVolumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"bar" | "table">("bar");

  // default to last 7 days
  const today = new Date();
  const defaultEnd = formatDate(today);
  const defaultStart = formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000));

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
        if (appliedStart) params.append("startDate", appliedStart);
        if (appliedEnd) params.append("endDate", appliedEnd);
        const url = `${API_PATHS.topSearchVolume}${params.toString() ? `?${params.toString()}` : ""}`;

        const result: any = await fetchFromAPI(url);

        // Normalize response shapes (raw array | nested driver shapes | { rows })
        let processed: any[] = [];
        if (!result) {
          processed = [];
        } else if (Array.isArray(result)) {
          if (result.length > 0 && Array.isArray(result[0])) processed = result[0];
          else if (result.length > 1 && result[1] && result[1].rows) processed = result[1].rows;
          else processed = result;
        } else if (result.rows && Array.isArray(result.rows)) {
          processed = result.rows;
        } else if (Array.isArray(result.data)) {
          processed = result.data;
        } else {
          processed = Array.isArray(result) ? result : [];
        }

        const filteredData = (processed || [])
          .filter((item: any) => item && (item.keyword || item.search_keyword))
          .map((item: any) => ({
            keyword: String(item.keyword ?? item.search_keyword ?? ""),
            search_volume: Number(item.search_volume ?? item.search_count ?? item.count ?? 0) || 0,
          }))
          .filter((r: TopSearchVolumeData) => r.keyword.trim() !== "")
          .sort((a: TopSearchVolumeData, b: TopSearchVolumeData) => b.search_volume - a.search_volume)
          .slice(0, 50);

        setData(filteredData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appliedStart, appliedEnd]);

  const handleChartTypeChange = (event: React.MouseEvent<HTMLElement>, newChartType: "bar" | "table") => {
    if (newChartType !== null) setChartType(newChartType);
  };

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

  return (
    <Card sx={{ m: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h5">Top Search Volume (Weekly)</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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

            <ToggleButtonGroup value={chartType} exclusive onChange={handleChartTypeChange} aria-label="chart type" size="small">
              <ToggleButton value="bar">Bar</ToggleButton>
              <ToggleButton value="table">Table</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length > 0 && (
          <>
            {chartType === "bar" && (
              <Box sx={{ width: "100%", height: 420, mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={100} interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="search_volume" fill="#8884d8" name="Search Volume">
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}

            {/* Table with exactly the requested columns */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Keyword</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>Search Volume</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.keyword}</TableCell>
                      <TableCell align="right">{item.search_volume}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {!loading && !error && data.length === 0 && <Alert severity="info">No search data available for selected range</Alert>}
      </CardContent>
    </Card>
  );
};

export default TopSearchVolume;