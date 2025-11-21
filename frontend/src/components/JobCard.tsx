import { Card, CardContent, Typography, Button } from "@mui/material";
import type { Job } from "../types/job";
import { useAuthStore } from "../store/authStore";

const JobCard = ({ job, onInterest }: { job: Job, onInterest: () => void }) => {
  const user = useAuthStore((s) => s.user);

  return (
    <Card className="mb-4 shadow">
      <CardContent>
        <Typography variant="h6">{job.summary}</Typography>
        <Typography className="mt-2 text-gray-700">{job.body}</Typography>
        <Typography className="text-sm mt-2 text-gray-500">
          Posted by {job.postedBy} • {new Date(job.postedDate).toLocaleDateString()}
        </Typography>

        {user?.role === "Viewer" && (
          <Button
            variant="contained"
            size="small"
            className="mt-4"
            onClick={onInterest}
          >
            Interested
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default JobCard;
