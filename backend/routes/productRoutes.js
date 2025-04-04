const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware"); // ✅ Correct import

// ✅ Protect product routes for both admin and superadmin
router.post("/create", verifyToken, authorizeRoles("admin", "superadmin"), createProduct);
router.get("/", getProducts);
router.put("/:id", verifyToken, authorizeRoles("admin", "superadmin"), updateProduct);
router.delete("/:id", verifyToken, authorizeRoles("admin", "superadmin"), deleteProduct);

module.exports = router;
