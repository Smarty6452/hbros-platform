// src/pages/Register.tsx
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ConstructionIcon from "@mui/icons-material/Construction";
import api from "../api/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Viewer",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: 480,
          p: 6,
          borderRadius: "20px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
        }}
      >
        {/* Logo & Title */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <ConstructionIcon sx={{ fontSize: 60, color: "#DC2626", mb: 2 }} />
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
            HandyBros
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#6B7280",
              fontWeight: 500
            }}
          >
            Create your account
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

        {/* Register Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            required
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
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
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
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
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
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
            select
            label="Account Type"
            name="role"
            fullWidth
            required
            value={form.role}
            onChange={handleChange}
            disabled={loading}
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
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
          >
            <MenuItem value="Poster">Poster - Post Jobs</MenuItem>
            <MenuItem value="Viewer">Viewer - Browse Jobs</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.8,
              fontSize: "1.1rem",
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
            Create Account
          </Button>
        </form>

        {/* Login Link */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography sx={{ color: "#6B7280", fontSize: "0.95rem" }}>
            Already have an account?{" "}
            <MuiLink 
              component={Link} 
              to="/login" 
              sx={{
                fontWeight: 700,
                color: "#DC2626",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline"
                }
              }}
            >
              Sign in here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Register;