import { useEffect, useState } from "react"
import { TextField, Button, Card, CardContent, Typography } from "@mui/material"
import { jobApi } from "../api/jobApi"
import { useNavigate, useParams } from "react-router-dom"

const EditJob = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({ title: "", body: "" })

  useEffect(() => {
    const loadJob = async () => {
      const { data } = await jobApi.getMy()
      const job = data.find((j: any) => j.id === Number(id))

      if (job) {
        setForm({
          title: job.title,
          body: job.body,
        })
      }
    }

    loadJob()
  }, [id])

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    await jobApi.update(Number(id), form)
    navigate("/dashboard")
  }

  return (
    <div className="flex justify-center mt-10 px-4">
      <Card className="w-full max-w-xl shadow">
        <CardContent>
          <Typography variant="h5" className="mb-4">Edit Job</Typography>

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
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditJob
