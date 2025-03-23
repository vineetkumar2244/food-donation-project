import React from "react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css"; // Import CSS

const LandingPage = () => {
    return (
        <div className="container">
            <h1>Welcome to Food Redistribution System</h1>
            <p>Join as a Donor or NGO to help redistribute surplus food.</p>

            <div className="button-container">
                <Link to="/register?role=donor">
                    <button className="btn donor">Register as Donor</button>
                </Link>

                <Link to="/register?role=ngo">
                    <button className="btn ngo">Register as NGO</button>
                </Link>

                <Link to="/login">
                    <button className="btn login">Login</button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;
