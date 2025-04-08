const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const verifyRole = require("../middleware/authMiddleware");
require("dotenv").config(); // ✅ Load .env file

const pythonPath = process.env.PYTHON_PATH || "python"; // ✅ Fallback to default if not set

const usersFilePath = path.join(__dirname, "../data/users.json");
const foodFilePath = path.join(__dirname, "../data/foodListings.json");

// Read Food Listings
const readFoodListings = () => {
    if (!fs.existsSync(foodFilePath)) {
        fs.writeFileSync(foodFilePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(foodFilePath, "utf8"));
};

// Write Food Listings
const writeFoodListings = (listings) => {
    fs.writeFileSync(foodFilePath, JSON.stringify(listings, null, 2));
};

// Read Users
const readUsers = () => {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
};

// Add Food Listing (Donor Only)
router.post("/add", verifyRole(["donor"]), async (req, res) => {
    const { foodItem, quantity, pickupLocation, expiryDate } = req.body;
    const donorId = req.user.id;

    if (!foodItem || !quantity || !pickupLocation || !expiryDate) {
        return res.status(400).json({ message: "All fields are required." });
    }

    let foodListings = readFoodListings();
    const newListing = {
        id: Date.now(),
        donorId,
        foodItem,
        quantity,
        pickupLocation,
        expiryDate,
        claimedBy: null
    };

    foodListings.push(newListing);
    writeFoodListings(foodListings);

    // Run Python model after add
    exec(`${pythonPath} demandModel.py`, (error, stdout, stderr) => {
        if (error) {
            console.error("Error running demand model after add:", error);
            return res.status(500).json({ message: "Food added, but failed to update demand scores." });
        }
        res.status(201).json({ message: "Food listing added and demand scores updated." });
    });
});

// Get All Food Listings (NGO Only)
router.get("/all", verifyRole(["ngo"]), (req, res) => {
    let foodListings = readFoodListings();
    let users = readUsers();
    const today = new Date();

    foodListings = foodListings.filter(listing => {
        const expiry = new Date(listing.expiryDate);
        return expiry >= today;
    });

    writeFoodListings(foodListings);

    foodListings = foodListings.map(listing => {
        const donor = users.find(user => user.id === listing.donorId);
        return {
            ...listing,
            donorName: donor ? donor.name : "Unknown",
            donorEmail: donor ? donor.email : "Unknown"
        };
    });

    res.json(foodListings);
});

// Get Donor's Own Listings
router.get("/my-listings", verifyRole(["donor"]), (req, res) => {
    const foodListings = readFoodListings();
    const donorListings = foodListings.filter(listing => listing.donorId === req.user.id);
    res.json(donorListings);
});

// Claim Food Listing (NGO Only)
router.put("/claim/:id", verifyRole(["ngo"]), (req, res) => {
    let foodListings = readFoodListings();
    const foodIndex = foodListings.findIndex(listing => listing.id == req.params.id);

    if (foodIndex === -1) {
        return res.status(404).json({ message: "Listing not found." });
    }

    if (foodListings[foodIndex].claimedBy) {
        return res.status(400).json({ message: "Food already claimed." });
    }

    foodListings[foodIndex].claimedBy = req.user.id;
    writeFoodListings(foodListings);

    // ✅ Use custom python path
    exec(`${pythonPath} demandModel.py`, (error, stdout, stderr) => {
        if (error) {
            console.error("Error running demand model after claim:", error);
            return res.status(500).json({ message: "Food claimed, but failed to update demand scores." });
        }

        res.json({ message: "Food claimed successfully and demand scores updated." });
    });
});

// Delete Listing (Donor Only)
router.delete("/delete/:id", verifyRole(["donor"]), (req, res) => {
    let foodListings = readFoodListings();
    const updatedListings = foodListings.filter(
        listing => listing.id != req.params.id || listing.donorId !== req.user.id
    );

    if (updatedListings.length === foodListings.length) {
        return res.status(403).json({ message: "Unauthorized to delete this listing." });
    }

    writeFoodListings(updatedListings);
    res.json({ message: "Listing deleted successfully." });
});

// Donor Report Generation Route
router.get("/report", verifyRole(["donor"]), (req, res) => {
    const donorId = req.user.id;
    const scriptPath = path.join(__dirname, "../donorReport.py");

    exec(`${pythonPath} ${scriptPath} ${donorId}`, (error, stdout, stderr) => {
        if (error) {
            console.error("Python error:", error);
            return res.status(500).json({ error: "Failed to generate report" });
        }

        const reportPath = path.join(__dirname, `../reports/${donorId}_report.pdf`);
        if (fs.existsSync(reportPath)) {
            res.sendFile(reportPath);
        } else {
            res.status(500).json({ error: "Report file not found" });
        }
    });
});

// NGO Report Generation Route
router.get("/ngo-report", verifyRole(["ngo"]), (req, res) => {
    const ngoId = req.user.id;
    const scriptPath = path.join(__dirname, "../ngoReport.py");

    exec(`${pythonPath} ${scriptPath} ${ngoId}`, (error, stdout, stderr) => {
        if (error) {
            console.error("Python error:", error);
            return res.status(500).json({ error: "Failed to generate NGO report" });
        }

        const reportPath = path.join(__dirname, `../reports/${ngoId}_report.pdf`);
        if (fs.existsSync(reportPath)) {
            res.sendFile(reportPath);
        } else {
            res.status(500).json({ error: "NGO Report file not found" });
        }
    });
});

module.exports = router;
