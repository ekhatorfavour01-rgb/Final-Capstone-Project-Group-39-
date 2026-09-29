const express = require("express");

const router = express.Router();

const authMiddleware = require("../Middleware/authMiddleware");
const cartController = require("../Controllers/cartController");

router.use(authMiddleware);

router.get("/", cartController.getCart);

router.post("/", cartController.addToCart);

router.patch("/:productId", cartController.updateCartItem);

router.delete("/:productId", cartController.removeFromCart);

router.delete("/", cartController.clearCart);

module.exports = router;