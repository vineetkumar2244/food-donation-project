import React from "react";
import { useNavigate } from "react-router-dom";

function DonorDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    return (
        <div>
            <h2>Donor Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default DonorDashboard;
