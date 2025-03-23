import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NgoDashboard() {
    const navigate = useNavigate();
    const [foodListings, setFoodListings] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchFoodListings();
    }, []);

    // Fetch all food listings
    const fetchFoodListings = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/food/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setFoodListings(data);
        } catch (error) {
            console.error("Error fetching listings:", error);
        }
    };

    // Claim food
    const handleClaim = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/food/claim/${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchFoodListings();
        } catch (error) {
            console.error("Error claiming food:", error);
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
    };

    return (
        <div>
            <h2>NGO Dashboard</h2>
            <button onClick={handleLogout}>Logout</button>

            <h3>Available Food Listings</h3>
            <ul>
                {foodListings.map((listing) => (
                    <li key={listing.id}>
                        {listing.foodItem} - {listing.quantity} (Pickup: {listing.pickupLocation}) 
                        {listing.claimedBy ? (
                            <span> (Claimed)</span>
                        ) : (
                            <button onClick={() => handleClaim(listing.id)}>Claim</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NgoDashboard;
