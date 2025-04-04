const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const authenticateAdmin = require("../middleware/authenticateAdmin");

const router = express.Router();
const SECRET_KEY = "mahesh"; // Change this to environment variable

// ✅ Admin Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ role: "admin", id: admin._id }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ message: "Admin login successful", token, role: "admin" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
