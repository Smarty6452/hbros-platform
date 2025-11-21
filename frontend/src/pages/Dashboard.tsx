// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
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
          ? await jobApi.getMy()
          : await jobApi.getAllWithParams(1, 20);
        setJobs(res.data);
      } catch (err: any) {
        console.error("Load jobs failed:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [user, isPoster]);

  const refresh = () => window.location.reload();

  if (loading) {
    return (
      <Box sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <CircularProgress size={70} thickness={4} sx={{ color: "#DC2626" }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      py: 8
    }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 6,
          flexWrap: "wrap",
          gap: 3
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <WorkIcon sx={{ fontSize: 48, color: "#DC2626" }} />
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                {isPoster() ? "My Posted Jobs" : "Available Jobs"}
              </Typography>
              <Typography sx={{ color: "#9CA3AF", fontSize: "1.1rem", mt: 0.5 }}>
                {isPoster() 
                  ? `Managing ${jobs.length} job posting${jobs.length !== 1 ? 's' : ''}`
                  : `Explore ${jobs.length} opportunity${jobs.length !== 1 ? 'ies' : 'y'}`
                }
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
                py: 1.8,
                px: 4,
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
                boxShadow: "0 4px 16px rgba(220, 38, 38, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)",
                  boxShadow: "0 6px 20px rgba(220, 38, 38, 0.5)",
                  transform: "translateY(-2px)"
                },
                transition: "all 0.3s ease"
              }}
            >
              Post New Job
            </Button>
          )}
        </Box>

        {/* Jobs Grid or Empty State */}
        {jobs.length === 0 ? (
          <Box sx={{
            textAlign: "center",
            py: 15,
            px: 4
          }}>
            <WorkIcon sx={{ fontSize: 100, color: "#374151", mb: 3, opacity: 0.5 }} />
            <Typography
              variant="h4"
              sx={{
                color: "#9CA3AF",
                fontWeight: 600,
                mb: 2
              }}
            >
              {isPoster()
                ? "No jobs posted yet"
                : "No active jobs available"}
            </Typography>
            <Typography
              sx={{
                color: "#6B7280",
                fontSize: "1.1rem",
                maxWidth: "500px",
                mx: "auto"
              }}
            >
              {isPoster()
                ? "Get started by creating your first job posting. Click the button above to begin!"
                : "Check back soon for new opportunities!"}
            </Typography>
          </Box>
        ) : (
          <Box sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)"
            }
          }}>
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onRefresh={refresh} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}