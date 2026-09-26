const express = require("express");

const router = express.Router();

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../Controllers/productController");


// Get all products
// Supports:
// ?search=shoe
// ?category=Shoes
// ?page=1
// ?limit=10
router.get("/", getProducts);


// Get one product
router.get("/:id", getProduct);


// Create a product
router.post("/", createProduct);


// Update a product
router.patch("/:id", updateProduct);


// Delete a product
router.delete("/:id", deleteProduct);


module.exports = router;
