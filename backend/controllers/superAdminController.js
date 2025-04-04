// controllers/superAdminController.js
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      admin.password = hashedPassword;
    }

    await admin.save();
    res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { updateAdmin };
