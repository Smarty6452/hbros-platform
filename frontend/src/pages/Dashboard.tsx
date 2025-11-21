// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  CircularProgress,
} from "@mui/material"; 

import { useAuthStore } from "../store/authStore";
import { jobApi } from "../api/jobApi";
import JobCard from "../components/JobCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, isPoster } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const loadJobs = async () => {
      try {
        setLoading(true);
        const res = isPoster()
          ? await jobApi.getMy()                          // Poster sees only their jobs
          : await jobApi.getAllWithParams(1, 20);         // Viewer sees public jobs
        setJobs(res.data);
      } catch (err: any) {
        console.error("Load jobs failed:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [user, isPoster]);

  const refresh = () => window.location.reload(); // simple but works

  if (loading) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress size={60} thickness={5} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" className="py-12">
      <Box className="flex justify-between items-center mb-10">
        <Typography variant="h4" className="font-bold text-blue-800">
          {isPoster() ? "My Posted Jobs" : "Available Jobs"}
        </Typography>

        {isPoster() && (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/create-job")}
            sx={{
              bgcolor: "#1e40af",
              px: 5,
              py: 1.5,
              fontWeight: "bold",
              boxShadow: 3,
              "&:hover": { bgcolor: "#1e3a8a" },
            }}
          >
            Post New Job
          </Button>
        )}
      </Box>

      {jobs.length === 0 ? (
        <Box className="text-center py-20">
          <Typography variant="h5" color="text.secondary">
            {isPoster()
              ? "You haven't posted any jobs yet. Click the button above to get started!"
              : "No active jobs right now. Check back soon!"}
          </Typography>
        </Box>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onRefresh={refresh} />
          ))}
        </div>
      )}
    </Container>
  );
}