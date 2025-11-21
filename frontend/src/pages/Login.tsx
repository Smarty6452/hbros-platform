
import React, { useState } from "react"
import api from "../api/api"
import { useAuthStore } from "../store/authStore"
import { useNavigate } from "react-router-dom"
import { TextField, Button, Paper, Typography, Box } from "@mui/material"

const Login = () => {
  const navigate = useNavigate()
  const loginStore = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await api.post("/auth/login", { email, password })
      const { token, user } = response.data

      loginStore.login(token, user)
      navigate("/dashboard")
    } catch {
      setError("Invalid email or password")
    }
  }

  return (
    <Box className="flex justify-center items-center min-h-screen p-4">
      <Paper elevation={3} className="w-full max-w-md p-6">
        <Typography variant="h5" className="font-bold text-center mb-4">
          Login
        </Typography>

        {error && (
          <Typography color="error" className="text-center mb-2">
            {error}
          </Typography>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default Login
