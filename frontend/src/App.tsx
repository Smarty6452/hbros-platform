// src/App.tsx
import React from "react"
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"

import ProtectedRoute from "./components/ProtectedRoute"

const App = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
