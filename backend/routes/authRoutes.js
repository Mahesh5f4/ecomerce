const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register API
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword, role });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});
router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) return res.status(400).json({ message: "User not found" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id, role: user.role }, "mahesh", { expiresIn: "1h" });
  
      res.json({ message: "Login successful", token, role: user.role });
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  });
   
  router.get("/profile", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  });

module.exports = router;
