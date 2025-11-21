// src/pages/EditJob.tsx
import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
  CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { jobApi } from "../api/jobApi";
import { useNavigate, useParams } from "react-router-dom";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", body: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      try {
        setInitialLoading(true);
        const { data } = await jobApi.getMy();
        const job = data.find((j: any) => j.id === Number(id));

        if (job) {
          setForm({
            title: job.title,
            body: job.body,
          });
        } else {
          setError("Job not found or you don't have permission to edit it");
        }
      } catch (err) {
        console.error("Failed to load job:", err);
        setError("Failed to load job details");
      } finally {
        setInitialLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.body.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await jobApi.update(Number(id), form);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Failed to update job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2
    }}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 700,
          p: 6,
          borderRadius: "20px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <EditIcon sx={{ fontSize: 60, color: "#DC2626", mb: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1
            }}
          >
            Edit Job
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "#6B7280",
              fontWeight: 500
            }}
          >
            Update your job posting details
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: "12px",
              backgroundColor: "#FEE2E2",
              color: "#991B1B",
              border: "1px solid #FCA5A5"
            }}
          >
            {error}
          </Alert>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Job Title"
            name="title"
            fullWidth
            required
            value={form.title}
            onChange={handleChange}
            disabled={loading}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "1.05rem",
                "&:hover fieldset": {
                  borderColor: "#DC2626",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#DC2626",
                  borderWidth: "2px"
                }
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#DC2626"
              }
            }}
          />

          <TextField
            label="Job Description"
            name="body"
            multiline
            rows={8}
            fullWidth
            required
            value={form.body}
            onChange={handleChange}
            disabled={loading}
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                fontSize: "1rem",
                "&:hover fieldset": {
                  borderColor: "#DC2626",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#DC2626",
                  borderWidth: "2px"
                }
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#DC2626"
              }
            }}
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              type="button"
              variant="outlined"
              size="large"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
              sx={{
                flex: 1,
                py: 1.8,
                fontSize: "1.05rem",
                fontWeight: 700,
                borderRadius: "10px",
                borderColor: "#374151",
                color: "#374151",
                borderWidth: "2px",
                "&:hover": {
                  borderColor: "#1F2937",
                  backgroundColor: "rgba(55, 65, 81, 0.05)",
                  borderWidth: "2px"
                }
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                flex: 1,
                py: 1.8,
                fontSize: "1.05rem",
                fontWeight: 700,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
                boxShadow: "0 4px 14px rgba(220, 38, 38, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)",
                  boxShadow: "0 6px 18px rgba(220, 38, 38, 0.5)"
                },
                "&:disabled": {
                  background: "#D1D5DB"
                }
              }}
            >
              {loading ? (
                <CircularProgress size={28} sx={{ color: "#FFFFFF" }} />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditJob;