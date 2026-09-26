const express = require("express");
const router = express.Router();

const { placeOrder, getMyOrders, getOrderById} = require('../Controllers/orderController');

const authMiddleware = require('../Middleware/authMiddleware');
const validate = require('../Middleware/validateMiddleware');
const { validatePlaceOrder } = require('../Validations/orderValidation');

router.post('/', authMiddleware, validate(validatePlaceOrder), placeOrder);
router.get('/my-orders', authMiddleware, getMyOrders);
router.get('/:id', authMiddleware, getOrderById);

module.exports = router;