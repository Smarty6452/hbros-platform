import { useState } from "react"
import { TextField, Button, MenuItem, Card, CardContent, Typography } from "@mui/material"
import api from "../api/api"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Viewer",
  })

  const navigate = useNavigate()

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      await api.post("/auth/register", form)
      navigate("/login")
    } catch (err) {
      console.error(err)
      alert("Registration failed")
    }
  }

  return (
    <div className="flex justify-center mt-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent>
          <Typography variant="h5" className="mb-4">
            Create Account
          </Typography>

          <TextField
            label="Name"
            name="name"
            fullWidth
            className="mb-4"
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            label="Email"
            name="email"
            fullWidth
            className="mb-4"
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            className="mb-4"
            value={form.password}
            onChange={handleChange}
          />

          <TextField
            select
            label="Select Role"
            name="role"
            className="mb-4"
            fullWidth
            value={form.role}
            onChange={handleChange}
          >
            <MenuItem value="Poster">Poster</MenuItem>
            <MenuItem value="Viewer">Viewer</MenuItem>
          </TextField>

          <Button variant="contained" fullWidth onClick={handleSubmit}>
            Register
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
