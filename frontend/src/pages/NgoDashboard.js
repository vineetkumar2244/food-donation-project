import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/NgoDashboard.module.css";

function NgoDashboard() {
    const navigate = useNavigate();
    const [availableListings, setAvailableListings] = useState([]);
    const [claimedListings, setClaimedListings] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchFoodListings();
    }, []);

    const fetchFoodListings = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/food/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            let data = await response.json();

            data = data.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

            setAvailableListings(data.filter(listing => !listing.claimedBy));
            setClaimedListings(data.filter(listing => listing.claimedBy));
        } catch (error) {
            console.error("Error fetching listings:", error);
        }
    };

    const handleClaim = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/food/claim/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                setTimeout(() => {
                    fetchFoodListings();
                }, 300);
            } else {
                const result = await response.json();
                console.error("Failed to claim food:", result.message);
            }
        } catch (error) {
            console.error("Error claiming food:", error);
        }
    };

    const handleDownloadReport = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/food/ngo-report", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to download NGO report");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "NGO_Report.pdf");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading NGO report:", error);
        }
    };

    const getPriorityLabel = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (diffDays <= 3) return { text: "High Priority", color: "red" };
        if (diffDays <= 5) return { text: "Medium Priority", color: "orange" };
        return { text: "Safe", color: "green" };
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.contentWrapper}>
                <div className={styles.header}>
                    <h2>NGO Dashboard</h2>
                    <button onClick={() => navigate("/")} className={styles.logoutButton}>Logout</button>
                </div>

                <button onClick={handleDownloadReport} className={styles.reportButton}>
                    Download NGO Report (PDF)
                </button>

                <div className={styles.section}>
                    <h3>Available Food Listings</h3>
                    {availableListings.length === 0 ? (
                        <p>No available food listings.</p>
                    ) : (
                        <ul>
                            {availableListings.map((listing) => {
                                const priority = getPriorityLabel(listing.expiryDate);
                                return (
                                    <li key={listing.id} style={{ borderLeft: `5px solid ${priority.color}` }}>
                                        <strong>{listing.foodItem}</strong> - {listing.quantity}
                                        (Pickup: {listing.pickupLocation}, Expires: {listing.expiryDate})
                                        <br />
                                        <em>Demand Score: {listing.demandScore ?? "Calculating..."}</em>
                                        <br />
                                        <span style={{ color: priority.color, fontWeight: "bold" }}>
                                            {priority.text}
                                        </span>
                                        <br />
                                        <button
                                            className={styles.claimButton}
                                            onClick={() => handleClaim(listing.id)}
                                        >
                                            Claim
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className={styles.section}>
                    <h3>Claimed Food Listings</h3>
                    {claimedListings.length === 0 ? (
                        <p>No claimed food listings.</p>
                    ) : (
                        <ul>
                            {claimedListings.map((listing) => (
                                <li key={listing.id}>
                                    <strong>{listing.foodItem}</strong> - {listing.quantity}
                                    (Pickup: {listing.pickupLocation}, Expires: {listing.expiryDate})
                                    <br />
                                    <em>Donor: {listing.donorName} ({listing.donorEmail})</em>
                                    <br />
                                    <em>Demand Score: {listing.demandScore ?? "N/A"}</em>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NgoDashboard;
