// src/components/Navbar.tsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Avatar,
  Chip,
  CircularProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import ConstructionIcon from "@mui/icons-material/Construction";
import PeopleIcon from "@mui/icons-material/People";

const Navbar = () => {
  const { user, token, logout, isAuthenticated, isPoster } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  if (token && !user) {
    return (
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)",
        }}
      >
        <Toolbar sx={{ justifyContent: "center", minHeight: "64px" }}>
          <CircularProgress sx={{ color: "#DC2626" }} size={32} />
        </Toolbar>
      </AppBar>
    );
  }

  // Mobile Drawer Content
  const drawer = (
    <Box sx={{ width: 280, height: "100%", bgcolor: "#0F172A" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid rgba(220, 38, 38, 0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <ConstructionIcon sx={{ fontSize: 32, color: "#DC2626" }} />
          <Typography sx={{ fontWeight: 800, color: "#F9FAFB", fontSize: "1.25rem" }}>
            HandyBros
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "#F9FAFB" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List sx={{ px: 1, py: 2 }}>
        {/* User Info (if authenticated) */}
        {isAuthenticated() && user && (
          <>
            <Box sx={{ px: 2, py: 2, mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: "#DC2626",
                    color: "#F9FAFB",
                    fontWeight: "bold",
                    width: 48,
                    height: 48,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography sx={{ color: "#F9FAFB", fontWeight: 600, fontSize: "1rem" }}>
                    {user.name}
                  </Typography>
                  <Chip
                    label={isPoster() ? "Poster" : "Viewer"}
                    size="small"
                    sx={{
                      bgcolor: isPoster() ? "#DC2626" : "#374151",
                      color: "#F9FAFB",
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      height: "22px",
                      mt: 0.5,
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Divider sx={{ bgcolor: "rgba(220, 38, 38, 0.2)", my: 1 }} />
          </>
        )}

        {/* Navigation Items */}
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/"
            onClick={handleNavClick}
            sx={{
              borderRadius: "8px",
              color: "#F9FAFB",
              "&:hover": { bgcolor: "rgba(220, 38, 38, 0.1)" },
            }}
          >
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        {isAuthenticated() && user && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/dashboard"
                onClick={handleNavClick}
                sx={{
                  borderRadius: "8px",
                  color: "#F9FAFB",
                  "&:hover": { bgcolor: "rgba(220, 38, 38, 0.1)" },
                }}
              >
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>

            {isPoster() && (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/interested-users"
                  onClick={handleNavClick}
                  sx={{
                    borderRadius: "8px",
                    color: "#F9FAFB",
                    bgcolor: "rgba(220, 38, 38, 0.1)",
                    "&:hover": { bgcolor: "rgba(220, 38, 38, 0.2)" },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PeopleIcon sx={{ fontSize: "1.2rem" }} />
                        <span>Interested Users</span>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            )}

            <Divider sx={{ bgcolor: "rgba(220, 38, 38, 0.2)", my: 2 }} />

            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  borderRadius: "8px",
                  color: "#DC2626",
                  border: "1px solid #DC2626",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#DC2626", color: "#F9FAFB" },
                }}
              >
                <ListItemText primary="Logout" sx={{ textAlign: "center" }} />
              </ListItemButton>
            </ListItem>
          </>
        )}

        {!isAuthenticated() && (
          <>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/login"
                onClick={handleNavClick}
                sx={{
                  borderRadius: "8px",
                  color: "#F9FAFB",
                  "&:hover": { bgcolor: "rgba(220, 38, 38, 0.1)" },
                }}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/register"
                onClick={handleNavClick}
                sx={{
                  borderRadius: "8px",
                  bgcolor: "#DC2626",
                  color: "#F9FAFB",
                  fontWeight: 700,
                  mt: 1,
                  "&:hover": { bgcolor: "#B91C1C" },
                }}
              >
                <ListItemText primary="Register" sx={{ textAlign: "center" }} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
          boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            px: { xs: 2, md: 6 },
            py: 1.5,
            minHeight: { xs: "64px", md: "72px" },
          }}
        >
          {/* LEFT: Logo + Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
            <ConstructionIcon sx={{ fontSize: { xs: 32, md: 40 }, color: "#DC2626" }} />
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{
                fontWeight: 800,
                color: "#F9FAFB",
                textDecoration: "none",
                letterSpacing: "0.5px",
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                "&:hover": {
                  color: "#DC2626",
                  transform: "scale(1.02)",
                },
                transition: "all 0.3s ease",
              }}
            >
              HandyBros
            </Typography>
          </Box>

          {/* DESKTOP: Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
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
                  color: "#DC2626",
                },
              }}
            >
              Home
            </Button>

            {isAuthenticated() && user ? (
              <>
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
                      color: "#DC2626",
                    },
                  }}
                >
                  Dashboard
                </Button>

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
                        borderColor: "#DC2626",
                      },
                    }}
                  >
                    Interested Users
                  </Button>
                )}

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: 1 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#DC2626",
                      color: "#F9FAFB",
                      fontWeight: "bold",
                      width: 44,
                      height: 44,
                      border: "2px solid rgba(220, 38, 38, 0.3)",
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
                        height: "22px",
                      }}
                    />
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleLogout}
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
                      borderColor: "#DC2626",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
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
                      color: "#DC2626",
                    },
                  }}
                >
                  Login
                </Button>

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
                      boxShadow: "0 6px 16px rgba(220, 38, 38, 0.5)",
                    },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>

          {/* MOBILE: Menu Icon */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { xs: "block", md: "none" }, color: "#F9FAFB" }}
          >
            <MenuIcon sx={{ fontSize: 32 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box" },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;