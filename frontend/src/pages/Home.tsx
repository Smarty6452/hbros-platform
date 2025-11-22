// src/pages/Home.tsx
import { useEffect, useState, useCallback, useMemo } from "react";
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
import type { Job } from "../api/job";

// Debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounced search handler
  const debouncedSetSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
        setPage(1); // Reset to first page on new search
      }, 500),
    []
  );

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await jobApi.getAllWithParams(page, 6, debouncedSearch);
      
      // Backend should return { data: Job[], total: number }
      // If backend returns array directly, handle it:
      if (Array.isArray(res.data)) {
        setJobs(res.data);
        // Estimate pages (backend should provide total)
        setTotalPages(res.data.length < 6 ? page : page + 1);
      } else {
        // Proper pagination response
        setJobs(res.data.data || []);
        setTotalPages(Math.ceil((res.data.total || 0) / 6));
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSetSearch(value);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              letterSpacing: "-1px",
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
            }}
          >
            HandyBros
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#9CA3AF",
              fontWeight: 500,
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.25rem" },
              px: 2,
            }}
          >
            Find trusted professionals for your home projects
          </Typography>
        </Box>

        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search for plumbers, electricians, carpenters..."
          value={searchInput}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#DC2626" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 700,
            mx: "auto",
            display: "block",
            mb: { xs: 4, md: 8 },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              "&:hover fieldset": {
                borderColor: "#DC2626",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#DC2626",
                borderWidth: "2px",
              },
            },
          }}
        />

        {/* Loading State */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 15,
            }}
          >
            <CircularProgress size={70} thickness={4} sx={{ color: "#DC2626" }} />
          </Box>
        ) : jobs.length === 0 ? (
          /* No Jobs Found */
          <Alert
            severity="info"
            sx={{
              maxWidth: 600,
              mx: "auto",
              py: 4,
              fontSize: { xs: "1rem", md: "1.1rem" },
              borderRadius: "12px",
              backgroundColor: "#1E293B",
              color: "#F9FAFB",
              border: "1px solid #374151",
              "& .MuiAlert-icon": {
                color: "#DC2626",
              },
            }}
          >
            No active jobs found. {searchInput && "Try a different search term."}
          </Alert>
        ) : (
          <>
            {/* Jobs Grid */}
            <Box
              sx={{
                display: "grid",
                gap: { xs: 3, md: 4 },
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                mb: { xs: 4, md: 8 },
              }}
            >
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} onRefresh={loadJobs} />
              ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: { xs: 4, md: 8 },
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "#F9FAFB",
                      fontWeight: 600,
                      fontSize: { xs: "0.9rem", md: "1rem" },
                      "&:hover": {
                        backgroundColor: "rgba(220, 38, 38, 0.2)",
                      },
                    },
                    "& .Mui-selected": {
                      backgroundColor: "#DC2626 !important",
                      color: "#F9FAFB",
                      "&:hover": {
                        backgroundColor: "#B91C1C !important",
                      },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}