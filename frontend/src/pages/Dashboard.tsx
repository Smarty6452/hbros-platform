// src/pages/Dashboard.tsx
import { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WorkIcon from "@mui/icons-material/Work";
import { useAuthStore } from "../store/authStore";
import { jobApi } from "../api/jobApi";
import JobCard from "../components/JobCard";
import { useNavigate } from "react-router-dom";
import type { Job } from "../api/job";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, isPoster } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadJobs = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = isPoster()
        ? await jobApi.getMy()
        : await jobApi.getAllWithParams(1, 20);

      setJobs(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err: any) {
      console.error("Load jobs failed:", err);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [user, isPoster]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={70} thickness={4} sx={{ color: "#DC2626" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: { xs: 4, md: 6 },
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2 } }}>
            <WorkIcon sx={{ fontSize: { xs: 40, md: 48 }, color: "#DC2626" }} />
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" },
                }}
              >
                {isPoster() ? "My Posted Jobs" : "Available Jobs"}
              </Typography>
              <Typography
                sx={{
                  color: "#9CA3AF",
                  fontSize: { xs: "0.95rem", md: "1.1rem" },
                  mt: 0.5,
                }}
              >
                {isPoster()
                  ? `Managing ${jobs.length} job posting${jobs.length !== 1 ? "s" : ""}`
                  : `Explore ${jobs.length} opportunit${jobs.length !== 1 ? "ies" : "y"}`}
              </Typography>
            </Box>
          </Box>

          {isPoster() && (
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate("/create-job")}
              sx={{
                py: { xs: 1.5, md: 1.8 },
                px: { xs: 3, md: 4 },
                fontSize: { xs: "0.95rem", md: "1rem" },
                fontWeight: 700,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
                boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
                alignSelf: { xs: "stretch", md: "auto" },
                "&:hover": {
                  background: "linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)",
                  boxShadow: "0 6px 20px rgba(220, 38, 38, 0.5)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Post New Job
            </Button>
          )}
        </Box>

        {/* Jobs Grid or Empty State */}
        {jobs.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: { xs: 10, md: 15 },
              px: { xs: 2, md: 4 },
            }}
          >
            <WorkIcon
              sx={{
                fontSize: { xs: 80, md: 100 },
                color: "#374151",
                mb: 3,
                opacity: 0.5,
              }}
            />
            <Typography
              variant="h4"
              sx={{
                color: "#9CA3AF",
                fontWeight: 600,
                mb: 2,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              {isPoster() ? "No jobs posted yet" : "No active jobs available"}
            </Typography>
            <Typography
              sx={{
                color: "#6B7280",
                fontSize: { xs: "1rem", md: "1.1rem" },
                maxWidth: "500px",
                mx: "auto",
              }}
            >
              {isPoster()
                ? "Get started by creating your first job posting. Click the button above to begin!"
                : "Check back soon for new opportunities!"}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: { xs: 3, md: 4 },
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
            }}
          >
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onRefresh={loadJobs} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}