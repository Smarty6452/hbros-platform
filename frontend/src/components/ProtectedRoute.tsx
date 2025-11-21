import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return (
    <Box className="flex justify-center items-center min-h-screen">
      <CircularProgress />
    </Box>
  );

  return children;
};

export default ProtectedRoute;