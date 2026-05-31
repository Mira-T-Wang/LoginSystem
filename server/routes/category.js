const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product");

// Get all categories with their products
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({});
    const products = await Product.find({}, { 
  name: 1, 
  price: 1, 
  quantity: 1, 
  image: 1, 
  category: 1,
  description: 1 
}).populate("category", "name");

    const categoriesWithProducts = categories.map((cat) => ({
      ...cat.toObject(),
      products: products.filter(
        (p) => p.category && p.category._id.toString() === cat._id.toString()
      ),
    }));

    return res.status(200).json(categoriesWithProducts);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

// Get single category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }
    return res.status(200).json(category);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

// Create category
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Category name is required." });
  }

  try {
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists." });
    }

    const category = await Category.create({ name, description });
    return res.status(201).json({
      message: "Category created successfully.",
      category,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

// Update category
router.put("/:id", async (req, res) => {
  const { name, description } = req.body;

  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { returnDocument: "after"}
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({
      message: "Category updated successfully.",
      category: updated,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found." });
    }

    return res.status(200).json({ message: "Category deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;