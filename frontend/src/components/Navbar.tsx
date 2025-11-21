// src/components/Navbar.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import ConstructionIcon from "@mui/icons-material/Construction";

const Navbar = () => {
  const { user, token, logout, isAuthenticated, isPoster } = useAuthStore();
  const navigate = useNavigate();

  // Show loading state while token exists but user not decoded yet
  if (token && !user) {
    return (
      <AppBar position="static" className="bg-gradient-to-r from-blue-700 to-indigo-800">
        <Toolbar className="justify-center">
          <CircularProgress color="inherit" size={28} />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static" className="bg-gradient-to-r from-blue-700 to-indigo-800 shadow-xl">
      <Toolbar className="flex justify-between px-4 py-3 md:px-8 min-h-16">

        {/* LEFT: Logo + Brand */}
        <Box className="flex items-center gap-3">
          <ConstructionIcon sx={{ fontSize: 36, color: "#FCD34D" }} />
          <Typography
            variant="h5"
            component={Link}
            to="/"
            className="font-extrabold tracking-tight text-white hover:text-yellow-300 transition no-underline"
          >
            HandyBros
          </Typography>
        </Box>

        {/* RIGHT: Navigation */}
        <Box className="flex items-center gap-4">

          {/* Always show Home */}
          <Button
            color="inherit"
            component={Link}
            to="/"
            className="font-semibold text-white hover:bg-white/10 px-4 py-2 rounded transition"
          >
            Home
          </Button>

          {/* Logged In */}
          {isAuthenticated() && user ? (
            <>
              {/* Dashboard Button */}
              <Button
                color="inherit"
                component={Link}
                to="/dashboard"
                className="font-semibold text-white hover:bg-white/10 px-4 py-2 rounded transition"
              >
                Dashboard
              </Button>

              {/* User Info */}
              <Box className="flex items-center gap-3">
                <Avatar
                  sx={{
                    bgcolor: "#FCD34D",
                    color: "#1E40AF",
                    fontWeight: "bold",
                    width: 40,
                    height: 40,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography variant="body1" className="text-white font-medium">
                    Hello, <span className="font-bold">{user.name.split(" ")[0]}</span>
                  </Typography>
                  <Chip
                    label={isPoster() ? "Poster" : "Viewer"}
                    size="small"
                    color={isPoster() ? "warning" : "info"}
                    variant="outlined"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      fontWeight: "bold",
                      height: 24,
                    }}
                  />
                </Box>
              </Box>

              {/* Logout */}
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderColor: "#FCD34D",
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            /* Not Logged In */
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                className="font-semibold text-white hover:bg-white/10 px-4 py-2 rounded transition"
              >
                Login
              </Button>

              <Button
                variant="contained"
                component={Link}
                to="/register"
                className="font-bold shadow-lg"
                sx={{
                  bgcolor: "#FCD34D",
                  color: "#1E40AF",
                  "&:hover": { bgcolor: "#FBBF24" },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;