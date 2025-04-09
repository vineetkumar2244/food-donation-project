import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/DonorDashboard.module.css";

function DonorDashboard() {
    const navigate = useNavigate();
    const [foodListings, setFoodListings] = useState([]);
    const [foodItem, setFoodItem] = useState("");
    const [quantity, setQuantity] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [activeListings, setActiveListings] = useState([]);
    const [claimedListings, setClaimedListings] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchFoodListings();
    }, []);

    const fetchFoodListings = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/food/my-listings", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setFoodListings(data);
            setActiveListings(data.filter(item => !item.claimedBy));
            setClaimedListings(data.filter(item => item.claimedBy));
        } catch (error) {
            console.error("Error fetching listings:", error);
        }
    };

    const handleAddListing = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/food/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ foodItem, quantity, pickupLocation, expiryDate }),
            });

            if (response.ok) {
                fetchFoodListings();
                setFoodItem("");
                setQuantity("");
                setPickupLocation("");
                setExpiryDate("");
            }
        } catch (error) {
            console.error("Error adding listing:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/food/delete/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchFoodListings();
        } catch (error) {
            console.error("Error deleting listing:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    const handleDownloadReport = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/food/report", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to download report");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Donor_Report.pdf");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Error downloading report:", error);
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.header}>
            <h2>Donor Dashboard</h2>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </div>


            <div className={styles.addSection}>
                <h3>Add Food Listing</h3>
                <input className={styles.input} type="text" placeholder="Food Item" value={foodItem} onChange={(e) => setFoodItem(e.target.value)} />
                <input className={styles.input} type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <input className={styles.input} type="text" placeholder="Pickup Location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Expiry Date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text";
                    }}
                />
                <button onClick={handleAddListing} className={styles.addButton}>Add Listing</button>
            </div>

            <div className={styles.section}>
                <h3>Monthly Donation Report</h3>
                <button onClick={handleDownloadReport} className={styles.reportButton}>Download Report</button>
            </div>

            <div className={styles.section}>
                <h3>Active Listings</h3>
                <ul>
                    {activeListings.map((listing) => (
                        <li key={listing.id}>
                            {listing.foodItem} - {listing.quantity} ({listing.pickupLocation}, Expires: {listing.expiryDate})
                            <button onClick={() => handleDelete(listing.id)} className={styles.deleteButton}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.section}>
                <h3>Claimed Listings</h3>
                <ul>
                    {claimedListings.map((listing) => (
                        <li key={listing.id}>
                            {listing.foodItem} - {listing.quantity} (Claimed)
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default DonorDashboard;
