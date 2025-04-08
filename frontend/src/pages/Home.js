// frontend/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";

function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.heading}>AI-Powered Food Redistribution</h1>
                <p className={styles.subheading}>
                    Connecting donors and NGOs to reduce food waste and fight hunger.
                </p>
                <div className={styles.buttonGroup}>
                    <Link to="/login">
                        <button className={styles.button}>Login</button>
                    </Link>
                    <Link to="/register">
                        <button className={styles.button}>Register</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
