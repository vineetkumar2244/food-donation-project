const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersFilePath = path.join(__dirname, '../data/users.json');
const SECRET_KEY = 'your_secret_key'; // Change this to a secure key

// Function to read users from users.json
const readUsers = () => {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, '[]'); // Create file if missing
    }
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    try {
        return JSON.parse(data); // Parse JSON file
    } catch (error) {
        return []; // If file is corrupted, return empty array
    }
};

// Function to write users to users.json
const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// **User Registration API**
const registerUser = (req, res) => {
    const { name, email, password, role } = req.body;

    let users = readUsers(); // Get current users

    // Check if email already exists
    if (users.some((user) => user.email === email)) {
        return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password before storing
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new user
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        role,
    };

    users.push(newUser); // Add user to array
    writeUsers(users); // Save updated users list

    res.json({ message: 'User registered successfully' });
};

// **User Login API**
const loginUser = (req, res) => {
    const { email, password } = req.body;

    const users = readUsers(); // Read users

    const user = users.find((u) => u.email === email);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, role: user.role });
};

module.exports = { registerUser, loginUser };
