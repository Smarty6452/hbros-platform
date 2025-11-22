// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import InterestedUsers from "./pages/InterestedUsers";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuthStore } from "./store/authStore";
import { startSignalR, stopSignalR } from "./services/signalr";

const App = () => {
  const { isAuthenticated, isPoster } = useAuthStore();

  // Fix: Use isAuthenticated as dependency, not isAuthenticated()
  useEffect(() => {
    if (isAuthenticated()) {
      startSignalR();
      return () => stopSignalR();
    }
  }, [isAuthenticated]);

  return (
    <ErrorBoundary>
      <div className="bg-gray-50 min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1F2937",
              color: "#F9FAFB",
              borderRadius: "10px",
              padding: "16px",
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#F9FAFB",
              },
            },
            error: {
              iconTheme: {
                primary: "#DC2626",
                secondary: "#F9FAFB",
              },
            },
          }}
        />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-job"
            element={
              <ProtectedRoute>
                {isPoster() ? <CreateJob /> : <Navigate to="/dashboard" replace />}
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-job/:id"
            element={
              <ProtectedRoute>
                <EditJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/interested-users"
            element={
              <ProtectedRoute>
                {isPoster() ? <InterestedUsers /> : <Navigate to="/dashboard" replace />}
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;