const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key"; // Use the same key as in authController

// Middleware to verify token and role
const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        try {
            const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
            req.user = decoded;

            // Check if user role is allowed
            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden: You do not have access to this resource." });
            }

            next();
        } catch (error) {
            res.status(400).json({ message: "Invalid token." });
        }
    };
};

module.exports = verifyRole;
