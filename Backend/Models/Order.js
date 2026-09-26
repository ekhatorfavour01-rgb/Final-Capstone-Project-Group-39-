const mongoose = require('mongoose');
const orderItemSchema = require('./OrderItem');

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: (items) => items.length > 0,
            message: 'An order must contain at least one item.'
        },
    },

    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },

    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },

    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
    },

    shippingAddress: {
        type: String,
        required: [true, 'Shipping address is required.'],
    },
},

{ timestamps: true }

);

module.exports = mongoose.model('Order', orderSchema);