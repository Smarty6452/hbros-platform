import React from "react"
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Typography variant="h6" component={Link} to="/" className="no-underline text-white">
          HandyBros
        </Typography>

        <Box className="space-x-4">
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          {isAuthenticated() ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>

              <Typography className="inline text-sm">
                Hello, {user?.name}
              </Typography>

              <Button
                color="inherit"
                onClick={() => {
                  logout()
                  navigate("/login")
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>

              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/register"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
