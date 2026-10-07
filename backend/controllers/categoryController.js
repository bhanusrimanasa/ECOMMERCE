const Category = require("../models/categoryModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorhander");

// 1. Create New Category (Admin)
exports.createCategory = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new ErrorHandler("Category name is required", 400));
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    return next(new ErrorHandler("Category already exists", 400));
  }

  const category = await Category.create({ name });

  res.status(201).json({
    success: true,
    category,
  });
});

// 2. Get All Categories (Public / Frontend)
exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 });

  res.status(200).json({
    success: true,
    categories,
  });
});

// 3. Delete Category (Admin)
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category Deleted Successfully",
  });
});