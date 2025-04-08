import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Register.module.css";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "donor",
    });

    const navigate = useNavigate();

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
                navigate("/");
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
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.heading}>Register</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                    <select
                        name="role"
                        onChange={handleChange}
                        className={styles.input}
                    >
                        <option value="donor">Donor</option>
                        <option value="ngo">NGO</option>
                    </select>
                    <button type="submit" className={styles.button}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
