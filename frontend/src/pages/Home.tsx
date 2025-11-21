// src/pages/Home.tsx
import React from "react"
import { Typography, Container, Paper, Box } from "@mui/material"

const Home = () => {
  return (
    <Container className="py-10">
      <Paper className="p-6 shadow-md">
        <Box>
          <Typography variant="h4" className="font-bold mb-4">
            Welcome to HandyBros Job Platform
          </Typography>

          <Typography variant="body1">
            Browse active job postings, register as a viewer to show interest, or log in as a poster to manage your job listings.
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default Home
