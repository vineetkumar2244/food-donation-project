import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div>
            <h2>General Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Dashboard;
