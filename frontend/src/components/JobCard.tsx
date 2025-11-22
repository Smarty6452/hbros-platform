// src/components/JobCard.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { jobApi } from "../api/jobApi";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import toast from "react-hot-toast";
import type { Job } from "../api/job";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? "Invalid Date"
    : date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
};

interface JobCardProps {
  job: Job;
  onRefresh?: () => void;
}

export default function JobCard({ job, onRefresh }: JobCardProps) {
  const { user, isPoster } = useAuthStore();
  const navigate = useNavigate();
  const [interestLoading, setInterestLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isOwner = isPoster() && job.posterId === user?.id;

  const handleInterest = async () => {
    setInterestLoading(true);
    try {
      await jobApi.interest(job.id);
      toast.success("Interest recorded! Poster will contact you.");
      onRefresh?.();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to express interest";
      toast.error(message);
    } finally {
      setInterestLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await jobApi.remove(job.id);
      toast.success("Job deleted successfully");
      setDeleteDialogOpen(false);
      onRefresh?.();
    } catch (err: any) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete job");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Card
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          border: "1px solid rgba(220, 38, 38, 0.1)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 30px rgba(220, 38, 38, 0.25)",
            borderColor: "#DC2626",
          },
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 }, flexGrow: 1, display: "flex", flexDirection: "column" }}>
          {/* Header with Title and Interest Badge */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
              gap: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#1F2937",
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                lineHeight: 1.3,
                flex: 1,
                wordBreak: "break-word",
              }}
            >
              {job.title}
            </Typography>

            {job.interestedCount > 0 && (
              <Chip
                icon={<PeopleIcon sx={{ fontSize: "1rem" }} />}
                label={job.interestedCount}
                size="small"
                sx={{
                  bgcolor: "#DC2626",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  height: "28px",
                  flexShrink: 0,
                }}
              />
            )}
          </Box>

          {/* Job Description */}
          <Typography
            sx={{
              color: "#4B5563",
              mb: 3,
              fontSize: { xs: "0.9rem", md: "0.95rem" },
              lineHeight: 1.6,
              whiteSpace: "pre-wrap",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              flexGrow: 1,
            }}
          >
            {job.body}
          </Typography>

          {/* Metadata */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
              <PersonIcon sx={{ fontSize: "1.1rem", color: "#DC2626" }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.85rem", md: "0.9rem" },
                }}
              >
                Posted by <strong style={{ color: "#1F2937" }}>{job.posterName}</strong>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarTodayIcon sx={{ fontSize: "1rem", color: "#DC2626" }} />
              <Typography
                variant="body2"
                sx={{
                  color: "#6B7280",
                  fontWeight: 500,
                  fontSize: { xs: "0.85rem", md: "0.9rem" },
                }}
              >
                {formatDate(job.postedDate)}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
            {!user ? (
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to="/login"
                sx={{
                  py: { xs: 1, md: 1.2 },
                  fontWeight: 700,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  borderRadius: "10px",
                  borderColor: "#DC2626",
                  color: "#DC2626",
                  borderWidth: "2px",
                  "&:hover": {
                    borderColor: "#B91C1C",
                    backgroundColor: "rgba(220, 38, 38, 0.05)",
                    borderWidth: "2px",
                  },
                }}
              >
                Login to Apply
              </Button>
            ) : isPoster() && isOwner ? (
              <>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/edit-job/${job.id}`)}
                  sx={{
                    flex: 1,
                    py: { xs: 1, md: 1.2 },
                    fontWeight: 700,
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    borderRadius: "10px",
                    borderColor: "#374151",
                    color: "#374151",
                    borderWidth: "2px",
                    minWidth: { xs: "100%", sm: "auto" },
                    "&:hover": {
                      borderColor: "#1F2937",
                      backgroundColor: "rgba(55, 65, 81, 0.05)",
                      borderWidth: "2px",
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setDeleteDialogOpen(true)}
                  sx={{
                    flex: 1,
                    py: { xs: 1, md: 1.2 },
                    fontWeight: 700,
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    borderRadius: "10px",
                    backgroundColor: "#DC2626",
                    minWidth: { xs: "100%", sm: "auto" },
                    "&:hover": {
                      backgroundColor: "#B91C1C",
                    },
                  }}
                >
                  Delete
                </Button>
              </>
            ) : !isPoster() ? (
              <Button
                variant="contained"
                fullWidth
                onClick={handleInterest}
                disabled={interestLoading}
                sx={{
                  py: { xs: 1, md: 1.2 },
                  fontWeight: 700,
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
                  boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)",
                    boxShadow: "0 6px 16px rgba(220, 38, 38, 0.4)",
                  },
                  "&:disabled": {
                    background: "#D1D5DB",
                  },
                }}
              >
                {interestLoading ? (
                  <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
                ) : (
                  "I'm Interested"
                )}
              </Button>
            ) : null}
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningAmberIcon sx={{ color: "#DC2626" }} />
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this job posting? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading} sx={{ color: "#6B7280" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={deleteLoading}
            sx={{
              bgcolor: "#DC2626",
              "&:hover": { bgcolor: "#B91C1C" },
            }}
          >
            {deleteLoading ? <CircularProgress size={24} sx={{ color: "#FFFFFF" }} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}