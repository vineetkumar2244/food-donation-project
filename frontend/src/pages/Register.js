import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css"; // Import the CSS file

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "donor", // Default role
    });

    const navigate = useNavigate(); // Hook for redirection

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert("Registration successful!");
                navigate("/"); // Redirect to Home page instead of Login
            } else {
                const data = await response.json();
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Error registering:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <select name="role" onChange={handleChange}>
                    <option value="donor">Donor</option>
                    <option value="ngo">NGO</option>
                </select>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
