// src/components/JobCard.tsx
import { Card, CardContent, Typography, Button, Chip, Box } from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { jobApi } from "../api/jobApi";

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
      alert("Interest recorded!");
      onRefresh?.();
    } catch (err: any) {
      alert(err.response?.data || "Already interested");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this job?")) return;
    await jobApi.remove(job.id);
    onRefresh?.();
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition">
      <CardContent>
        <Box className="flex justify-between items-start mb-3">
          <Typography variant="h6" className="font-bold text-blue-800">
            {job.title}
          </Typography>
          {job.interestedCount > 0 && (
            <Chip label={`${job.interestedCount} interested`} color="error" size="small" />
          )}
        </Box>

        <Typography className="text-gray-700 mb-4 whitespace-pre-wrap">
          {job.body}
        </Typography>

        <Typography variant="body2" color="text.secondary" className="mb-4">
          Posted by <strong>{job.posterName}</strong> • {formatDate(job.postedDate)}
        </Typography>

        <Box className="flex gap-3">
          {!user ? (
            <Button variant="outlined" fullWidth component={Link} to="/login">
              Login to Apply
            </Button>
          ) : isPoster() && isOwner ? (
            <>
              <Button variant="outlined" onClick={() => navigate(`/edit-job/${job.id}`)}>
                Edit
              </Button>
              <Button variant="contained" color="error" onClick={handleDelete}>
                Delete
              </Button>
            </>
          ) : !isPoster() ? (
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={handleInterest}
            >
              I'm Interested
            </Button>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
}