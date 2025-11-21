import { useState } from "react"
import { TextField, Button, Card, CardContent, Typography } from "@mui/material"
import { jobApi } from "../api/jobApi"
import { useNavigate } from "react-router-dom"

const CreateJob = () => {
  const [form, setForm] = useState({
    title: "",
    body: "",
  })

  const navigate = useNavigate()

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    try {
      await jobApi.create(form)
      navigate("/dashboard")
    } catch (err) {
      console.error(err)
      alert("Failed to create job")
    }
  }

  return (
    <div className="flex justify-center mt-10 px-4">
      <Card className="w-full max-w-xl shadow">
        <CardContent>
          <Typography variant="h5" className="mb-4">Post a New Job</Typography>

          <TextField
            label="Job Title"
            name="title"
            fullWidth
            className="mb-4"
            value={form.title}
            onChange={handleChange}
          />

          <TextField
            label="Job Description"
            name="body"
            multiline
            minRows={4}
            fullWidth
            className="mb-4"
            value={form.body}
            onChange={handleChange}
          />

          <Button variant="contained" fullWidth onClick={handleSubmit}>
            Create Job
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateJob
