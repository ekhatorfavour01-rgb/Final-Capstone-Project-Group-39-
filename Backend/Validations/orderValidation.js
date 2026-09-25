const validatePlaceOrder = (body) => {

    const errors = [];
    const { shippingAddress } = body;

    if (!shippingAddress || shippingAddress.trim().length === 0) {
        errors.push('Shipping address is required');
    }

    return errors;
};

const validateOrderStatusUpdate = (body) => {

    const errors = [];
    const validStatuses = ['Pending', 'Proccessing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!body.status || !validStatuses.includes(body.status)) {
        errors.push(`Status must be one of: ${validStatuses.join(' ')}`);
    }

    return errors;
};

module.exports = {
    validatePlaceOrder,
    validateOrderStatusUpdate
};