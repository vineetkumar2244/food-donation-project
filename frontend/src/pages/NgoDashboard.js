import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

            // Sort by soonest expiry first
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
                fetchFoodListings(); // Refresh listings after claiming
            } else {
                console.error("Failed to claim food.");
            }
        } catch (error) {
            console.error("Error claiming food:", error);
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
        <div>
            <h2>NGO Dashboard</h2>
            <button onClick={() => navigate("/")}>Logout</button>

            {/* Available Listings */}
            <h3>Available Food Listings</h3>
            {availableListings.length === 0 ? (
                <p>No available food listings.</p>
            ) : (
                <ul>
                    {availableListings.map((listing) => {
                        const priority = getPriorityLabel(listing.expiryDate);
                        return (
                            <li key={listing.id} style={{ borderLeft: `5px solid ${priority.color}`, paddingLeft: "10px", marginBottom: "10px" }}>
                                <strong>{listing.foodItem}</strong> - {listing.quantity}  
                                (Pickup: {listing.pickupLocation}, Expires: {listing.expiryDate})  
                                <br />
                                <em>Demand Score: {listing.demandScore ?? "Calculating..."}</em>  
                                <br />
                                <span style={{ color: priority.color, fontWeight: "bold" }}>{priority.text}</span>  
                                <br />
                                <button onClick={() => handleClaim(listing.id)}>Claim</button>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Claimed Listings */}
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
    );
}

export default NgoDashboard;
