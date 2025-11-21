// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;

  if (!user) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gray-50">
        <CircularProgress size={60} thickness={5} />
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;