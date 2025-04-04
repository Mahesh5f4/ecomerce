const jwt = require("jsonwebtoken");

const SECRET_KEY = "mahesh"; // Ensure it matches your backend secret key

const authenticateSuperAdmin = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Access Denied! No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);

        if (decoded.role !== "superadmin") {
            return res.status(403).json({ message: "Access Forbidden! Super Admins only." });
        }

        req.superAdmin = decoded; // Store super admin info in request
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token!" });
    }
};

module.exports = authenticateSuperAdmin; // ✅ Ensure it's exported correctly
