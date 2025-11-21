import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Box, Alert } from "@mui/material";
import JobCard from "../components/JobCard";
import { jobApi } from "../api/jobApi";

const Home = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    jobApi
      .getAll()
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load jobs");
        setLoading(false);
      });
  }, []);

  if (loading) return <Box className="flex justify-center mt-20"><CircularProgress size={60} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" className="py-10">
      <Typography variant="h3" className="text-center mb-8 font-bold text-blue-700">
        Active Job Postings
      </Typography>

      {jobs.length === 0 ? (
        <Typography className="text-center text-gray-600 text-xl">No active jobs right now.</Typography>
      ) : (
        <Box className="space-y-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onInterest={() => jobApi.interest(job.id).then(() => alert("Interest recorded!"))}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Home;