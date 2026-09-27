const productService = require('../Services/productService');
const orderService = require('../Services/orderService');
const User = require('../Models/User');
const { successResponse } = require('../Utils/apiResponse');

// ---- product (Admin only) -----
const createProduct = async (req, res, next) => {

    try {
        const product = await productService.createProduct(req.body);

        return successResponse(res, 201, 'Product created successfully', product);

    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {

    try {
        const product = await productService.updateProduct(req.params.id, req.body);

        return successResponse(res, 200, 'Product updated successfully', product);

    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {

    try {
        await productService.deleteProduct(req.params.id);

        return successResponse(res, 200, 'Product deleted successfully');

    } catch (error) {
        next(error);
    }
};


// ----- orders (Admin only) -----
const getAllOrders = async (req, res, next) => {

    try {
        const { status, page, limit } = req.query;
        const result = await orderService.getAllOrders({ status, page, limit });

        return successResponse(res, 200, 'Orders fetched successfully', result);

    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {

    try {
        const order = await orderService.getOrderById(req.params.id, req.user.id, true);

        return successResponse(res, 200, 'Order fetched successfully', order);

    } catch (error) {
        next(error);
    }
};

const updateOrderStatus = async (req, res, next) => {

    try {
        const order = await orderService.updateOrderStatus(req.params.id, req.body.status);

        return successResponse(res, 200, 'Order status updated successfully', order);

    } catch (error) {
        next(error);
    }
};


// ------ Users (Admin only) ------
const getAllUsers = async (req, res, next) => {

    try {
        const users = await User.find();

        return successResponse(res, 200, 'Users fetched successfully', users);

    } catch (error) {
        next(error);
    }
}


module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getAllUsers
}