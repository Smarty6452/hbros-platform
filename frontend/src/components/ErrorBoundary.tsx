// src/components/ErrorBoundary.tsx
import React, { Component, ReactNode } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
            p: 2,
          }}
        >
          <Paper
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: "center",
              maxWidth: 500,
              borderRadius: "16px",
            }}
          >
            <ErrorOutlineIcon
              sx={{ fontSize: { xs: 64, md: 80 }, color: "#DC2626", mb: 2 }}
            />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#1F2937",
                mb: 2,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Oops! Something went wrong
            </Typography>
            <Typography sx={{ color: "#6B7280", mb: 4, fontSize: { xs: "0.95rem", md: "1rem" } }}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </Typography>
            {this.state.error && (
              <Typography
                sx={{
                  color: "#DC2626",
                  fontSize: "0.85rem",
                  mb: 3,
                  p: 2,
                  bgcolor: "#FEE2E2",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  textAlign: "left",
                  overflow: "auto",
                }}
              >
                {this.state.error.message}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={this.handleReload}
              sx={{
                bgcolor: "#DC2626",
                "&:hover": { bgcolor: "#B91C1C" },
                fontWeight: 700,
                px: 4,
                py: 1.5,
              }}
            >
              Reload Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;