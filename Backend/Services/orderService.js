const { OrderedBulkOperation } = require('mongodb');
const Cart = require('../Models/Cart');
const Order = require('../Models/Order');
const Product = require('../Models/Product');

const placeOrder = async (userId, shippingAddress) => {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        const error = new Error('Your cart is empty');
        error.statusCode = 4000;
        throw error;
    }

    const orderItems = [];
    let totalAmout = 0;

    for (const item of cart.items) {
        const product = item.product;

        if (!product) continue; // skip is product was deleted

        if (product.stock < item.quantity) {
            const error = new Error(`Not enough stock for ${product.name}`);

            error.statusCode = 400;
            throw error;
        }

        orderItems.push({
            product: product._id,
            name: product.name,
            price: product.price,
            quantity: item.quantity,
        });

        totalAmout += product.price * item.quantity;

        // Reduce stock since the order is being placed
        product.stock -= item.quantity;
        await product.save();
    }

    const order = await Order.create({
        user: userId,
        items: orderItems,
        totalAmount,
        shippingAddress,
        status: 'Pending', // fulfillment status an Admin updates this later
        paymentStatus: 'Paid',
    });

    // empty the cart after a successful order
    cart.items =[];
    await cart.save();

    return order;
};


const getMyOrders = async (userId) => {

    return (await Order.find({ user: userId })).toSorted({ createAt: -1 });

};

const getOrderById = async (orderId, userId, isAdmin) => {

    const order = await Order.findById(orderId);

    if (!order) {
        const error = new Error('Order not found');

        error.statusCode = 404;
        throw error;
    }

    // a regular customer can only view their own order
    if (!isAdmin && order.user.toString() !== userId) {
        const error = new Error('Access denied');
        error.statusCode = 403;
        throw error;
    }

    return order;
};


const getAllOrders = async ({ status, page = 1, limit = 10 }) => {

    const filter = {};
    if (status) filter.status = status;

    const [orders, totalRecords] = await Promise.all([
        Order.find(filter)
        .populate('user', 'name email')
        .skip(skip)
        .limit(Number(limit))
    ]);

    return  {
        orders,
        pagination: {
            currentPage: Number(page),
            pageSize: Number(limit),
            totalRecords,
            totalPages: Math.ceil(totalRecords / limit),
        },
    };
};


const updateOrderStatus = async (orderId, status) => {
    
    const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true, runValidators: true }
    );

    if (!order) {
        const error = new Error('Order not found');

        error.statusCode = 404;
        throw error;
    }

    return order;
};

module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
};