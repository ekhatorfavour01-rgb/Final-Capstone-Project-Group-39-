const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },

        brand: {
            type: String,
            default: "",
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },

        oldPrice: {
            type: Number,
            min: [0, "Old price cannot be negative"],
        },

        discount: {
            type: String,
            default: "",
            trim: true,
        },

        stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Stock quantity must be a whole number",
            },
            default: 0,
        },

        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },

        color: {
            type: String,
            default: "",
            trim: true,
        },

        rating: {
            type: Number,
            min: [0, "Rating cannot be below 0"],
            max: [5, "Rating cannot exceed 5"],
            default: 0,
        },

        badge: {
            type: String,
            default: "",
            trim: true,
        },

        image: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Product", productSchema);
