const express = require("express");
const router = express.Router();

const {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getAllUsers,
    getAuditLogs,
} = require("../Controllers/adminController");

const authMiddleware = require("../Middleware/authMiddleware");
const adminMiddleware = require("../Middleware/adminMiddleware");
const validate = require("../Middleware/validateMiddleware");
const {
    validateProduct,
    validateProductUpdate,
} = require("../Validations/productValidation");
const { validateOrderStatusUpdate } = require("../Validations/orderValidation");

// applies to everything below: must be login and also be an Admin
router.use(authMiddleware, adminMiddleware);

// ------ products ------
router.post("/products", validate(validateProduct), createProduct);
router.put("/products/:id", validate(validateProductUpdate), updateProduct);
router.delete("/products/:id", deleteProduct);

// ------ Orders ------
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);
router.put(
    "/orders/:id/status",
    validate(validateOrderStatusUpdate),
    updateOrderStatus,
);

// ------ Users ------
router.get("/users", getAllUsers);
router.get("/audit-logs", getAuditLogs);

module.exports = router;
