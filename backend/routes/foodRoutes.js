const express = require("express");
const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

// Example protected routes
router.post("/add-food", authenticateUser, authorizeRole(["donor"]), (req, res) => {
    res.json({ message: "Food added successfully!" });
});

router.get("/view-donations", authenticateUser, authorizeRole(["ngo", "individual"]), (req, res) => {
    res.json({ message: "List of food donations" });
});

module.exports = router;
