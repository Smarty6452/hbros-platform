// src/pages/InterestedUsers.tsx
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Avatar,
  CircularProgress,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import { jobApi } from "../api/jobApi";
import { useAuthStore } from "../store/authStore";
import { Navigate } from "react-router-dom";

export default function InterestedUsers() {
  const { isPoster } = useAuthStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPoster()) return;
    
    jobApi.getInterestedUsers()
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load interested users:", err);
        setLoading(false);
      });
  }, [isPoster]);

  if (!isPoster()) return <Navigate to="/dashboard" />;

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
      py: 8
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{
          textAlign: "center",
          mb: 6
        }}>
          <PeopleIcon sx={{ fontSize: 60, color: "#DC2626", mb: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1
            }}
          >
            Interested Applicants
          </Typography>
          <Typography
            sx={{
              color: "#9CA3AF",
              fontSize: "1.2rem",
              fontWeight: 500
            }}
          >
            View all users interested in your job postings
          </Typography>
        </Box>

        {/* Table */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)"
                }}
              >
                <TableCell
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "1rem",
                    py: 2.5,
                    borderBottom: "none"
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WorkIcon sx={{ fontSize: "1.2rem" }} />
                    Job Title
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "1rem",
                    py: 2.5,
                    borderBottom: "none"
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PeopleIcon sx={{ fontSize: "1.2rem" }} />
                    Applicant
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "1rem",
                    py: 2.5,
                    borderBottom: "none"
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon sx={{ fontSize: "1.2rem" }} />
                    Email
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "1rem",
                    py: 2.5,
                    borderBottom: "none"
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarTodayIcon sx={{ fontSize: "1rem" }} />
                    Applied On
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ py: 12, textAlign: "center", border: "none" }}>
                    <CircularProgress size={60} thickness={4} sx={{ color: "#DC2626" }} />
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ py: 12, textAlign: "center", border: "none" }}>
                    <PeopleIcon sx={{ fontSize: 80, color: "#D1D5DB", mb: 2 }} />
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#6B7280",
                        fontWeight: 600,
                        mb: 1
                      }}
                    >
                      No Applicants Yet
                    </Typography>
                    <Typography sx={{ color: "#9CA3AF" }}>
                      Users who express interest in your jobs will appear here
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#FEF2F2"
                      },
                      transition: "background-color 0.2s ease"
                    }}
                  >
                    <TableCell
                      sx={{
                        py: 2.5,
                        borderBottom: i === data.length - 1 ? "none" : "1px solid #F3F4F6"
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#1F2937",
                          fontSize: "0.95rem"
                        }}
                      >
                        {row.jobTitle}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2.5,
                        borderBottom: i === data.length - 1 ? "none" : "1px solid #F3F4F6"
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: "#DC2626",
                            color: "#FFFFFF",
                            fontWeight: "bold"
                          }}
                        >
                          {row.userName[0].toUpperCase()}
                        </Avatar>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: "#374151",
                            fontSize: "0.95rem"
                          }}
                        >
                          {row.userName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2.5,
                        borderBottom: i === data.length - 1 ? "none" : "1px solid #F3F4F6"
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#6B7280",
                          fontSize: "0.9rem",
                          fontFamily: "monospace"
                        }}
                      >
                        {row.userEmail}
                      </Typography>
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 2.5,
                        borderBottom: i === data.length - 1 ? "none" : "1px solid #F3F4F6"
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#6B7280",
                          fontSize: "0.9rem",
                          fontWeight: 500
                        }}
                      >
                        {new Date(row.interestedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Box>
  );
}