import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box, Alert, CircularProgress } from "@mui/material";
import api from "../api/api";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isPoster } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { Token: token } = res.data; // Your backend uses "Token"

      login(token); // This decodes everything correctly

      // Small delay to ensure Zustand updates
      setTimeout(() => {
        navigate("/dashboard"); // Always go to dashboard — it's now smart!
      }, 100);

    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Paper elevation={12} className="w-full max-w-md p-10 rounded-2xl shadow-2xl">
        <Box className="text-center mb-8">
          <Typography variant="h3" className="font-bold text-blue-700">HandyBros</Typography>
          <Typography variant="h6" className="text-gray-600 mt-2">Welcome Back</Typography>
        </Box>

        {error && <Alert severity="error" className="mb-6">{error}</Alert>}

        <form onSubmit={handleLogin} className="space-y-6">
          <TextField label="Email" type="email" fullWidth required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          <TextField label="Password" type="password" fullWidth required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />

          <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} className="py-4 text-lg font-semibold bg-blue-700 hover:bg-blue-800">
            {loading ? <CircularProgress size={28} color="inherit" /> : "Login"}
          </Button>
        </form>

        <Typography className="text-center mt-6 text-gray-600">
          Don't have an account? <Button component={Link} to="/register" color="primary" className="font-bold">Register here</Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;