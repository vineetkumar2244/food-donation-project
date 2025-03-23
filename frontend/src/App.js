import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Import the landing page
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DonorDashboard from "./pages/DonorDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <Routes>
                {/* Set Landing Page as Default */}
                <Route path="/" element={<Home />} />

                {/* Auth Routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/donor-dashboard"
                    element={
                        <ProtectedRoute role="donor">
                            <DonorDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ngo-dashboard"
                    element={
                        <ProtectedRoute role="ngo">
                            <NgoDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* 404 Page */}
                <Route path="*" element={<h2>404 - Page Not Found</h2>} />
            </Routes>
        </Router>
    );
}

export default App;
