const cartService = require("../Services/cartService");
const auditService = require("../Services/auditService");
const { successResponse } = require("../Utils/apiResponse");

const getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getCart(req.user.id);

        return successResponse(res, 200, "Cart fetched successfully", cart);
    } catch (error) {
        next(error);
    }
};

const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await cartService.addToCart(
            req.user.id,
            productId,
            quantity,
        );
        await auditService.recordEvent({
            actorId: req.user.id,
            action: "cart.item_added",
            targetType: "product",
            targetId: productId,
            details: { quantity: Number(quantity || 1) },
        });

        return successResponse(
            res,
            200,
            "Product added to cart successfully",
            cart,
        );
    } catch (error) {
        next(error);
    }
};

const updateCartItem = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        const cart = await cartService.updateCartItem(
            req.user.id,
            productId,
            quantity,
        );
        await auditService.recordEvent({
            actorId: req.user.id,
            action: "cart.item_updated",
            targetType: "product",
            targetId: productId,
            details: { quantity: Number(quantity) },
        });

        return successResponse(
            res,
            200,
            "Cart item updated successfully",
            cart,
        );
    } catch (error) {
        next(error);
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const cart = await cartService.removeFromCart(req.user.id, productId);
        await auditService.recordEvent({
            actorId: req.user.id,
            action: "cart.item_removed",
            targetType: "product",
            targetId: productId,
        });

        return successResponse(
            res,
            200,
            "Product removed from cart successfully",
            cart,
        );
    } catch (error) {
        next(error);
    }
};

const clearCart = async (req, res, next) => {
    try {
        const cart = await cartService.clearCart(req.user.id);
        await auditService.recordEvent({
            actorId: req.user.id,
            action: "cart.cleared",
            targetType: "cart",
            targetId: cart.id,
        });

        return successResponse(res, 200, "Cart cleared successfully", cart);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
};
