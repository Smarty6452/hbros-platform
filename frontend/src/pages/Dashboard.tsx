// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { Typography, Button, Card, CardContent } from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { jobApi } from "../api/jobApi";
import JobCard from "../components/JobCard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, isPoster } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 useEffect(() => {
  if (!user) return;

  const loadJobs = async () => {
    try {
      setLoading(true);
      const { data } = user.role === "Poster" 
        ? await jobApi.getMy()
        : await jobApi.getAll();
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadJobs();
}, [user?.role]); 

  if (!user) return <p className="text-center mt-20">Please login</p>;
  if (loading) return <p className="text-center mt-20">Loading jobs...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <Typography variant="h4" className="font-bold text-blue-800">
          {isPoster() ? "My Posted Jobs" : "All Active Jobs"}
        </Typography>
        {isPoster() && (
          <Button variant="contained" size="large" onClick={() => navigate("/create-job")}>
            Post New Job
          </Button>
        )}
      </div>

      {jobs.length === 0 ? (
        <Card className="p-10 text-center">
          <Typography variant="h6" color="text.secondary">
            {isPoster() ? "You haven't posted any jobs yet." : "No active jobs available."}
          </Typography>
        </Card>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onInterest={() => jobApi.interest(job.id).then(() => alert("Interest recorded!"))}
              onDelete={isPoster() ? async () => {
                if (confirm("Delete this job?")) {
                  await jobApi.remove(job.id);
                  setJobs(jobs.filter(j => j.id !== job.id));
                }
              } : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;