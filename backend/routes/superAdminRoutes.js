const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");
const { updateAdmin } = require("../controllers/superAdminController");

const router = express.Router();
const SECRET_KEY = "mahesh";

// ✅ Hardcoded Super Admin Credentials
const SUPER_ADMIN_EMAIL = "mahesh20104@gmail.com";
const SUPER_ADMIN_PASSWORD = "mahesh143";

// ✅ Super Admin Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD) {
            const token = jwt.sign({ role: "superadmin", email }, SECRET_KEY, { expiresIn: "1h" });
            return res.json({ message: "Super Admin login successful", token, role: "superadmin" });
        }

        return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Register a New Admin (Super Admin Only)
router.post("/add-admin", authenticateAdmin, async (req, res) => {
    try {
        if (req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Unauthorized: Only Super Admin can add admins" });
        }

        const { name, email, password } = req.body;

        let admin = await Admin.findOne({ email });
        if (admin) return res.status(400).json({ message: "Admin already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        admin = new Admin({ name, email, password: hashedPassword });

        await admin.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Get All Admins (Super Admin Only)
router.get("/admins", authenticateAdmin, async (req, res) => {
    try {
        if (req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Unauthorized: Only Super Admin can view admins" });
        }

        const admins = await Admin.find().select("-password");
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Update Admin (Super Admin Only)
router.put(
    "/edit-admin/:id",
    verifyToken,
    authorizeRoles("superadmin"),
    updateAdmin
);

// ✅ Delete Admin (Super Admin Only)
router.delete("/delete-admin/:id", authenticateAdmin, async (req, res) => {
    try {
        if (req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Unauthorized: Only Super Admin can delete admins" });
        }

        const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);

        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ✅ Reset Admin Password (Super Admin Only)
router.put("/reset-password/:id", authenticateAdmin, async (req, res) => {
    try {
        if (req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Unauthorized: Only Super Admin can reset passwords" });
        }

        const { newPassword } = req.body;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedAdmin = await Admin.findByIdAndUpdate(
            req.params.id,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
