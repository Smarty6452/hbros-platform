import React, { useState } from "react"
import api from "../api/api"
import { useNavigate } from "react-router-dom"
import { TextField, Button, Paper, Typography, Box } from "@mui/material"

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await api.post("/auth/register", form)
      navigate("/login")
    } catch {
      setError("Registration failed. Try again.")
    }
  }

  return (
    <Box className="flex justify-center items-center min-h-screen p-4">
      <Paper elevation={3} className="w-full max-w-md p-6">
        <Typography variant="h5" className="font-bold text-center mb-4">
          Register
        </Typography>

        {error && (
          <Typography color="error" className="text-center mb-2">
            {error}
          </Typography>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <TextField
            name="name"
            label="Name"
            fullWidth
            variant="outlined"
            onChange={handleChange}
          />

          <TextField
            name="email"
            label="Email"
            fullWidth
            variant="outlined"
            onChange={handleChange}
          />

          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            onChange={handleChange}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
          >
            Register
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

export default Register
