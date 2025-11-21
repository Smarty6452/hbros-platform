import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Divider,
} from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { jobApi } from "../api/jobApi";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "Just now";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function JobCard({ job, onRefresh }: { job: any; onRefresh?: () => void }) {
  const { user, isPoster } = useAuthStore();
  const navigate = useNavigate();
  const isOwner = isPoster() && job.posterName === user?.name;

  const handleInterest = async () => {
    if (!job?.id) {
      alert("Cannot express interest: Job ID missing");
      return;
    }

    try {
      await jobApi.interest(job.id);
      onRefresh?.();
      alert("You've shown interest in this job!");
    } catch (err: any) {
      alert(err.response?.data || "Already interested or job expired");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this job?")) return;
    await jobApi.remove(job.id);
    onRefresh?.();
  };

  return (
    <Card className="h-full shadow-lg hover:shadow-xl transition">
      <CardContent>
        <Box className="flex justify-between items-start mb-2">
          <Typography variant="h6" className="font-bold text-blue-800">
            {job.title}
          </Typography>
          {job.interestedCount > 0 && (
            <Chip label={job.interestedCount} color="error" size="small" />
          )}
        </Box>

        <Typography className="text-gray-700 mb-3 whitespace-pre-wrap">
          {job.body}
        </Typography>

        <Divider className="my-3" />

        <Typography variant="body2" color="text.secondary">
          Posted by <strong>{job.posterName}</strong> • {formatDate(job.postedDate)}
        </Typography>

        <Box className="mt-4 flex gap-2">
          {!user ? (
            <Button variant="outlined" fullWidth href="/login">
              Login to Apply
            </Button>
          ) : user.role === "Viewer" ? (
            <Button
              variant="contained"
              color="error"
              startIcon={<FavoriteBorderIcon />}
              onClick={handleInterest}
              fullWidth
            >
              I'm Interested
            </Button>
          ) : isOwner ? (
            <>
              <Button variant="outlined" onClick={() => navigate(`/edit-job/${job.id}`)}>
                Edit
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
}