import { Card, CardContent, Typography, Button, Chip, Box } from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { jobApi } from "../api/jobApi";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import toast from "react-hot-toast";

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function JobCard({ job, onRefresh }: { job: any; onRefresh?: () => void }) {
  const { user, isPoster } = useAuthStore();
  const navigate = useNavigate();
  const isOwner = isPoster() && job.posterId === user?.id;

const handleInterest = async () => {
  try {
    await jobApi.interest(job.id);
    toast.success("Interest recorded! Poster notified.");
    onRefresh?.();
  } catch (err: any) {
    toast.error(err.response?.data || "Already interested");
  }
};

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) return;
    try {
      await jobApi.remove(job.id);
      onRefresh?.();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete job");
    }
  };

  return (
    <Card 
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
        border: "1px solid rgba(220, 38, 38, 0.1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 30px rgba(220, 38, 38, 0.25)",
          borderColor: "#DC2626"
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with Title and Interest Badge */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{
              fontWeight: 800,
              color: "#1F2937",
              fontSize: "1.25rem",
              lineHeight: 1.3,
              flex: 1
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
                ml: 2
              }}
            />
          )}
        </Box>

        {/* Job Description */}
        <Typography 
          sx={{
            color: "#4B5563",
            mb: 3,
            fontSize: "0.95rem",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {job.body}
        </Typography>

        {/* Metadata */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <PersonIcon sx={{ fontSize: "1.1rem", color: "#DC2626" }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#6B7280",
                fontWeight: 500
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
                fontWeight: 500
              }}
            >
              {formatDate(job.postedDate)}
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {!user ? (
            <Button 
              variant="outlined" 
              fullWidth 
              component={Link} 
              to="/login"
              sx={{
                py: 1.2,
                fontWeight: 700,
                borderRadius: "10px",
                borderColor: "#DC2626",
                color: "#DC2626",
                borderWidth: "2px",
                "&:hover": {
                  borderColor: "#B91C1C",
                  backgroundColor: "rgba(220, 38, 38, 0.05)",
                  borderWidth: "2px"
                }
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
                  py: 1.2,
                  fontWeight: 700,
                  borderRadius: "10px",
                  borderColor: "#374151",
                  color: "#374151",
                  borderWidth: "2px",
                  "&:hover": {
                    borderColor: "#1F2937",
                    backgroundColor: "rgba(55, 65, 81, 0.05)",
                    borderWidth: "2px"
                  }
                }}
              >
                Edit
              </Button>
              <Button 
                variant="contained" 
                onClick={handleDelete}
                sx={{
                  flex: 1,
                  py: 1.2,
                  fontWeight: 700,
                  borderRadius: "10px",
                  backgroundColor: "#DC2626",
                  "&:hover": {
                    backgroundColor: "#B91C1C"
                  }
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
              sx={{
                py: 1.2,
                fontWeight: 700,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
                boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #B91C1C 0%, #DC2626 100%)",
                  boxShadow: "0 6px 16px rgba(220, 38, 38, 0.4)"
                }
              }}
            >
              I'm Interested
            </Button>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
}