// src/pages/Login.tsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import ConstructionIcon from "@mui/icons-material/Construction";
import api from "../api/api";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.Token || res.data.token;

      if (!token) {
        throw new Error("Server did not return a token");
      }

      const success = login(token);

      if (!success) {
        setError("Invalid token format or role not allowed");
        return;
      }

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 300);

    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        "Invalid email or password. Please try again."
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
            Sign in to continue
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

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          />

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
            {loading ? (
              <CircularProgress size={28} sx={{ color: "#FFFFFF" }} />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Register Link */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography sx={{ color: "#6B7280", fontSize: "0.95rem" }}>
            Don't have an account?{" "}
            <MuiLink 
              component={Link} 
              to="/register" 
              sx={{
                fontWeight: 700,
                color: "#DC2626",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline"
                }
              }}
            >
              Register here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}