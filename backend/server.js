const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// ✅ Import routes
const adminRoutes = require("./routes/adminRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require('./routes/productRoutes');
// ✅ Corrected Routes
app.use("/api/admins", adminRoutes);   // Admin Login
app.use("/api/superadmin", superAdminRoutes);  // Super Admin functionalities
app.use("/api/users", userRoutes);  // User-related endpoints
app.use('/api/products', productRoutes)

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
