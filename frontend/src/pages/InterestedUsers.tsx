// src/pages/InterestedUsers.tsx
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
    jobApi.getInterestedUsers().then(res => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  if (!isPoster()) return <Navigate to="/dashboard" />;

  return (
    <Container maxWidth="lg" className="py-10">
      <Typography variant="h4" className="font-bold text-blue-800 mb-8 text-center">
        Users Interested in My Jobs
      </Typography>

      <Paper elevation={3}>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-700">
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Job Title</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Interested User</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-gray-500">No one has shown interest yet.</TableCell></TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow key={i} hover>
                  <TableCell>{row.jobTitle}</TableCell>
                  <TableCell>
                    <Chip label={row.userName} color="primary" />
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