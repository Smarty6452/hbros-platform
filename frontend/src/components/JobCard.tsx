import { Card, CardContent, Typography, Button } from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job, onInterest, onDelete }: { job: any; onInterest: () => void; onDelete?: () => void }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isOwner = user?.role === "Poster" && job.posterName === user.name;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardContent>
        <Typography variant="h5" className="font-bold text-blue-700">{job.title}</Typography>
        <Typography className="mt-3 text-gray-700 whitespace-pre-wrap">{job.body}</Typography>

        <Typography className="text-sm text-gray-500 mt-3">
          Posted by <strong>{job.posterName}</strong> • {new Date(job.postedDate).toLocaleDateString()}
          {" • "}
          <strong>{job.interestedCount} interested</strong>
        </Typography>

        <div className="mt-5 flex gap-3 flex-wrap">
          {user && user.role === "Viewer" && (
            <Button variant="contained" color="primary" size="small" onClick={onInterest}>
              I'm Interested
            </Button>
          )}

          {isOwner && (
            <>
              <Button variant="outlined" size="small" onClick={() => navigate(`/edit-job/${job.id}`)}>
                Edit
              </Button>
              {onDelete && (
                <Button variant="contained" color="error" size="small" onClick={onDelete}>
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;