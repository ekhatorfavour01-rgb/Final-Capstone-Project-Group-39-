const orderService = require('../Services/orderService');
const { successResponse } = require('../Utils/apiResponse');

const placeOrder = async (req, res) => {

    try {
        const { shippingAddress } = req.body;

        const order = await orderService.placeOrder(req.user.id, shippingAddress);

        return successResponse(res, 201, 'Order placed successfully', order);
    } catch (error) {
        next(error);
    }
};

const getMyOrders = async (req, res, next) => {

    try {
        const orders = await orderService.getMyOrders(req.user.id);
        
        return successResponse(res, 200, 'Orders fetched successfully', orders);
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {

    try {
        const order = await orderService.getOrderById(req.params.id, req.user.id, false);
        
        return successResponse(res, 200, 'Order fetched successfully', order);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getOrderById
};