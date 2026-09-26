

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
=======
const express = require('express');
const router = express.Router();

module.exports = router;
>>>>>>> c862a1b46cc7b01f56ac2ff78cb9bd8d26d46994
=======
const express = require('express');
const router = express.Router();

module.exports = router;
>>>>>>> origin/main
