import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>Welcome to the AI-Powered Food Redistribution System</h1>
            <p>Connect donors with NGOs to reduce food waste and help those in need.</p>
            <Link to="/login"><button>Login</button></Link>
            <Link to="/register"><button>Register</button></Link>
        </div>
    );
}

export default Home;
