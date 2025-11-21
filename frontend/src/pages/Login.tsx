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

      // .NET returns "Token" or "token"
      const token = res.data.Token || res.data.token;

      if (!token) {
        throw new Error("Server did not return a token");
      }

      const success = login(token);

      if (!success) {
        setError("Invalid token format or role not allowed");
        return;
      }

      // Success! Redirect to dashboard
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
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Paper elevation={20} className="w-full max-w-md p-10 rounded-3xl shadow-2xl">
        <Box className="text-center mb-10">
          <Typography variant="h2" className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-800">
            HandyBros
          </Typography>
          <Typography variant="h5" color="text.secondary" className="mt-3">
            Sign in to continue
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-6 rounded-xl">
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            variant="outlined"
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{
              py: 2,
              fontSize: "1.1rem",
              fontWeight: "bold",
              background: "linear-gradient(to right, #1e40af, #4338ca)",
              "&:hover": { background: "linear-gradient(to right, #1e3a8a, #3730a3)" },
            }}
          >
            {loading ? <CircularProgress size={28} color="inherit" /> : "Sign In"}
          </Button>
        </form>

        <Box className="text-center mt-8">
          <Typography>
            Don't have an account?{" "}
            <MuiLink component={Link} to="/register" className="font-bold text-blue-600 hover:underline">
              Register here
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}