const express = require('express');
const router = express.Router();

<<<<<<< HEAD

const { createProduct, updateProduct, deleteProduct, getAllOrders, getOrderById, updateOrderStatus} = require('../Controllers/adminController');

const authMiddleware = require('../Middleware/authMiddleware');
const adminMiddleware = require('../Middleware/adminMiddleware');
const validate = require('../Middleware/validateMiddleware');
const { validateProduct } = require('../Validations/productValidation');
const { validateOrderStatusUpdate } = require('../Validations/orderValidation');



// applies to everything below: must be login and also be an Admin
router.use(authMiddleware, adminMiddleware);

// ------ products ------
router.post('/products', validate(validateProduct), createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// ------ Orders ------
router.get('/orders', getAllOrders);
router.get('/orders/:id', getOrderById);
router.put('/orders/:id/status', validate(validateOrderStatusUpdate), updateOrderStatus);

=======
>>>>>>> c6b52293299c414f55e7cec4902e12891df56e76
module.exports = router;