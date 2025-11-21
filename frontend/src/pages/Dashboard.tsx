// src/pages/Dashboard.tsx
import { Container, Typography, Paper } from "@mui/material"
import { useAuthStore } from "../store/authStore"

const Dashboard = () => {
  const user = useAuthStore((s) => s.user)

  return (
    <Container className="py-10">
      <Paper className="p-6 shadow-md">
        <Typography variant="h5" className="font-bold">
          Dashboard
        </Typography>

        <Typography className="mt-2">
          Welcome, {user?.name}.  
        </Typography>

        <Typography className="text-sm mt-2 text-gray-600">
          You will see job posting tools here in Step 2.
        </Typography>
      </Paper>
    </Container>
  )
}

export default Dashboard
