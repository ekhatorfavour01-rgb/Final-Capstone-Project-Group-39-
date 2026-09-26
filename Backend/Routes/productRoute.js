const express = require("express");
const router = express.Router();

const { getProducts, getProduct } = require("../Controllers/productController");

router.get("/", getProducts); // supports ?search=&category=&page=&limit=
router.get("/:id", getProduct);

module.exports = router;