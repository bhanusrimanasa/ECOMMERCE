const express = require("express");
const {
  createCategory,
  getAllCategories,
  deleteCategory,
} = require("../controllers/categoryController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Public route to fetch all categories
router.route("/categories").get(getAllCategories);

// Admin routes to create and delete categories
router
  .route("/admin/category/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createCategory);

router
  .route("/admin/category/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCategory);

module.exports = router;