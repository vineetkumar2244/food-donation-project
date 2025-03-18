const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersFilePath = path.join(__dirname, "../data/users.json");
const secretKey = "your_secret_key"; // Ensure it matches authMiddleware.js

// Function to read users from JSON
const readUsers = () => {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
};

// Function to write users to JSON
const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// **User Registration**
const registerUser = (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required." });
    }

    let users = readUsers();
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { id: Date.now(), name, email, password: hashedPassword, role };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: "User registered successfully." });
};

// **User Login**
const loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const users = readUsers();
    const user = users.find(user => user.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: "1h" });
    res.json({ token, role: user.role });
};

// **Get All Users** (Admin Only)
const getAllUsers = (req, res) => {
    const users = readUsers();
    res.json(users);
};

// **Get User by ID** (Admin Only)
const getUserById = (req, res) => {
    const users = readUsers();
    const user = users.find(user => user.id == req.params.id);

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
};

// **Delete User** (Admin Only)
const deleteUser = (req, res) => {
    let users = readUsers();
    const updatedUsers = users.filter(user => user.id != req.params.id);

    if (users.length === updatedUsers.length) {
        return res.status(404).json({ message: "User not found." });
    }

    writeUsers(updatedUsers);
    res.json({ message: "User deleted successfully." });
};

// **Export Controller Functions**
module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    deleteUser
};
