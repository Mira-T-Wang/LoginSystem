const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `product-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

//check for jfif
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".jfif"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG images are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category", "name")
      .populate("createdBy", "email");
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "email");
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

// Create product
router.post("/", upload.single("image"), async (req, res) => {
  const { name, description, price, quantity, category, createdBy } = req.body;

  console.log("Received body:", req.body);
  console.log("Received file:", req.file);

  if (!name || !description || !price || !category || !createdBy) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      quantity: quantity ? parseInt(quantity) : 0,
      category,
      createdBy,
      image: req.file ? req.file.filename : "",
    });

    const populated = await product.populate("category", "name");
    return res.status(201).json({
      message: "Product created successfully.",
      product: populated,
    });
  } catch (err) {
    console.error("Product create error:", err.message);
    return res.status(500).json({ message: err.message || "Server error." });
  }
});

// Update product
router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, description, price, quantity, category } = req.body;

  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: "Product not found." });
    }

    const updateData = { name, description, price: parseFloat(price), quantity: parseInt(quantity), category };

    if (req.file) {
      // Delete old image file
      const oldImagePath = path.join(uploadsDir, existing.image);
      if (existing.image && fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      updateData.image = req.file.filename;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { returnDocument: "after"}
    ).populate("category", "name");

    return res.status(200).json({
      message: "Product updated successfully.",
      product: updated,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Delete image file
    if (product.image) {
      const imagePath = path.join(uploadsDir, product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;