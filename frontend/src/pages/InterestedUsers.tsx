import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  Box,
  Avatar,
} from "@mui/material";
import { jobApi } from "../api/jobApi";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";

export default function InterestedUsers() {
  const { isPoster } = useAuthStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPoster()) return;
    jobApi.getInterestedUsers()
      .then(res => {
        setData(res.data);
        setLoading(false);
      });
  }, []);

  if (!isPoster()) return <Navigate to="/dashboard" />;

  return (
    <Container maxWidth="lg" className="py-12">
      <Typography variant="h4" className="font-bold text-blue-800 mb-8 text-center">
        Users Interested in My Jobs
      </Typography>

      <Paper elevation={6} className="overflow-hidden">
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1e40af" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Job</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Applicant</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Applied On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Loading applicants...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-500 text-lg">
                  No one has applied to your jobs yet.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow key={i} hover>
                  <TableCell>
                    <Typography variant="subtitle1" className="font-medium">
                      {row.jobTitle}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box className="flex items-center gap-3">
                      <Avatar sx={{ width: 32, height: 32 }}>
                        {row.userName[0]}
                      </Avatar>
                      <span>{row.userName}</span>
                    </Box>
                  </TableCell>
                  <TableCell>{row.userEmail}</TableCell>
                  <TableCell>
                    {new Date(row.interestedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}