import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  Box,
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
  const pageSize = 6;

  const loadJobs = async () => {
    setLoading(true);
    try {
      const { data } = await jobApi.getAllWithParams(page, pageSize, search);
      setJobs(data.jobs || data);
      // If backend doesn't return total, estimate
      setTotalPages(data.totalPages || Math.ceil((data.length || 10) / pageSize) || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [page, search]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <Container maxWidth="lg" className="py-10">
      <Box className="text-center mb-10">
        <Typography variant="h3" className="font-bold text-blue-800 mb-4">
          Welcome to HandyBros
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Find skilled professionals for your home projects
        </Typography>
      </Box>

      <TextField
        fullWidth
        placeholder="Search jobs by title or description..."
        value={search}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 6, maxWidth: 600, mx: "auto", display: "block" }}
      />

      {loading ? (
        <Box className="flex justify-center py-20">
          <CircularProgress size={60} />
        </Box>
      ) : jobs.length === 0 ? (
        <Alert severity="info" className="max-w-2xl mx-auto">
          No active jobs found. {search && "Try adjusting your search."}
        </Alert>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} onRefresh={loadJobs} />
            ))}
          </div>

          <Box className="flex justify-center mt-10">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, p) => setPage(p)}
              color="primary"
              size="large"
            />
          </Box>
        </>
      )}
    </Container>
  );
}