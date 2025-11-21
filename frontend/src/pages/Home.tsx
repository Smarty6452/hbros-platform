import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import JobCard from "../components/JobCard";
import { jobApi } from "../api/jobApi";

export default function Home() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await jobApi.getAllWithParams(page, 6, search);
      setJobs(res.data);
      // Estimate pages if backend doesn't send total
      setTotalPages(res.data.length < 6 ? page : page + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page, search]);

  return (
    <Container maxWidth="lg" className="py-12">
      <Box className="text-center mb-10">
        <Typography variant="h3" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800">
          HandyBros Home Comfort
        </Typography>
        <Typography variant="h6" color="text.secondary" className="mt-4">
          Find trusted professionals for your home projects
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="Search for plumbers, electricians, carpenters..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ maxWidth: 700, mx: "auto", display: "block", mb: 8 }}
        variant="outlined"
      />

      {loading ? (
        <Box className="flex justify-center py-20">
          <CircularProgress size={60} thickness={5} />
        </Box>
      ) : jobs.length === 0 ? (
        <Alert severity="info" className="max-w-2xl mx-auto text-center py-8 text-lg">
          No active jobs found. {search && "Try a different search term."}
        </Alert>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onRefresh={loadJobs} />
            ))}
          </div>

          <Box className="flex justify-center mt-12">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, p) => setPage(p)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}
    </Container>
  );
}