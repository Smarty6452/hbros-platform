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
import PeopleIcon from "@mui/icons-material/People";

const Navbar = () => {
  const { user, token, logout, isAuthenticated, isPoster } = useAuthStore();
  const navigate = useNavigate();

  if (token && !user) {
    return (
      <AppBar 
        position="static" 
        sx={{ 
          background: "linear-gradient(90deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)"
        }}
      >
        <Toolbar sx={{ justifyContent: "center", minHeight: "64px" }}>
          <CircularProgress sx={{ color: "#DC2626" }} size={32} />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: "linear-gradient(90deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
        boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)"
      }}
    >
      <Toolbar sx={{ 
        justifyContent: "space-between", 
        px: { xs: 2, md: 6 }, 
        py: 1.5,
        minHeight: "72px"
      }}>
        
        {/* LEFT: Logo + Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <ConstructionIcon sx={{ fontSize: 40, color: "#DC2626" }} />
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: 800,
              color: "#F9FAFB",
              textDecoration: "none",
              letterSpacing: "0.5px",
              "&:hover": { 
                color: "#DC2626",
                transform: "scale(1.02)"
              },
              transition: "all 0.3s ease"
            }}
          >
            HandyBros
          </Typography>
        </Box>

        {/* RIGHT: Navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          
          {/* Home Button */}
          <Button
            component={Link}
            to="/"
            sx={{
              color: "#F9FAFB",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "rgba(220, 38, 38, 0.1)",
                color: "#DC2626"
              }
            }}
          >
            Home
          </Button>

          {isAuthenticated() && user ? (
            <>
              {/* Dashboard Button */}
              <Button
                component={Link}
                to="/dashboard"
                sx={{
                  color: "#F9FAFB",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                    color: "#DC2626"
                  }
                }}
              >
                Dashboard
              </Button>

              {/* Interested Users - Only for Posters */}
              {isPoster() && (
                <Button
                  component={Link}
                  to="/interested-users"
                  startIcon={<PeopleIcon />}
                  sx={{
                    color: "#F9FAFB",
                    fontWeight: 700,
                    px: 3,
                    py: 1,
                    borderRadius: "8px",
                    border: "2px solid #DC2626",
                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                    "&:hover": {
                      backgroundColor: "#DC2626",
                      borderColor: "#DC2626"
                    }
                  }}
                >
                  Interested Users
                </Button>
              )}

              {/* User Info */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "#DC2626",
                    color: "#F9FAFB",
                    fontWeight: "bold",
                    width: 44,
                    height: 44,
                    border: "2px solid rgba(220, 38, 38, 0.3)"
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography sx={{ color: "#F9FAFB", fontWeight: 600, fontSize: "0.95rem" }}>
                    {user.name.split(" ")[0]}
                  </Typography>
                  <Chip
                    label={isPoster() ? "Poster" : "Viewer"}
                    size="small"
                    sx={{
                      bgcolor: isPoster() ? "#DC2626" : "#374151",
                      color: "#F9FAFB",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      height: "22px"
                    }}
                  />
                </Box>
              </Box>

              {/* Logout Button */}
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                sx={{
                  borderColor: "#DC2626",
                  color: "#DC2626",
                  fontWeight: 600,
                  px: 2.5,
                  py: 0.8,
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#DC2626",
                    color: "#F9FAFB",
                    borderColor: "#DC2626"
                  }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: "#F9FAFB",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "rgba(220, 38, 38, 0.1)",
                    color: "#DC2626"
                  }
                }}
              >
                Login
              </Button>

              {/* Register Button */}
              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{
                  bgcolor: "#DC2626",
                  color: "#F9FAFB",
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.4)",
                  "&:hover": {
                    bgcolor: "#B91C1C",
                    boxShadow: "0 6px 16px rgba(220, 38, 38, 0.5)"
                  }
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