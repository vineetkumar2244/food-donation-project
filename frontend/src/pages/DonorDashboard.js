import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    // Fetch donor's listings
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

    // Add a new listing
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

    return (
        <div>
            <h2>Donor Dashboard</h2>
            <button onClick={() => navigate("/")}>Logout</button>

            <h3>Add Food Listing</h3>
            <input type="text" placeholder="Food Item" value={foodItem} onChange={(e) => setFoodItem(e.target.value)} />
            <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            <input type="text" placeholder="Pickup Location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
            <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            <button onClick={handleAddListing}>Add Listing</button>

            <h3>Active Listings</h3>
            <ul>
                {activeListings.map((listing) => (
                    <li key={listing.id}>
                        {listing.foodItem} - {listing.quantity} (Pickup: {listing.pickupLocation}, Expires: {listing.expiryDate})
                        <button onClick={() => handleDelete(listing.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h3>Claimed Listings</h3>
            <ul>
                {claimedListings.map((listing) => (
                    <li key={listing.id}>
                        {listing.foodItem} - {listing.quantity} (Claimed)
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DonorDashboard;
