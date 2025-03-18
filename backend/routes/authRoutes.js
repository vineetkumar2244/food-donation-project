const express = require("express");
const { registerUser, loginUser, getAllUsers, getUserById, deleteUser } = require("../controllers/authController");
const verifyRole = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes
router.get("/users", verifyRole(["admin"]), getAllUsers); // Only admin can view all users
router.get("/users/:id", verifyRole(["admin"]), getUserById); // Only admin can view user details
router.delete("/users/:id", verifyRole(["admin"]), deleteUser); // Only admin can delete users

module.exports = router;
