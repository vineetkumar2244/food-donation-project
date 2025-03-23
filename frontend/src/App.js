import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; 
import Register from "./pages/Register";
import Login from "./pages/Login";
import DonorDashboard from "./pages/DonorDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <Routes>
                {/* Set Home as Default Landing Page */}
                <Route path="/" element={<Home />} />

                {/* Authentication Routes */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Dashboards */}
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
