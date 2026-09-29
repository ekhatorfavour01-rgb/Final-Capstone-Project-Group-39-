const Cart = require("../Models/Cart");
const Product = require("../Models/Product");

const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  return cart;
};


const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const requestedQuantity = Number(quantity);

  if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
    const error = new Error("Quantity must be a positive whole number");
    error.statusCode = 400;
    throw error;
  }

  if (requestedQuantity > product.stock) {
    const error = new Error("Requested quantity exceeds available stock");
    error.statusCode = 400;
    throw error;
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity: requestedQuantity,
        },
      ],
    });

    return await cart.populate("items.product");
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + requestedQuantity;

    if (newQuantity > product.stock) {
      const error = new Error("Requested quantity exceeds available stock");
      error.statusCode = 400;
      throw error;
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      quantity: requestedQuantity,
    });
  }

  await cart.save();

  return await cart.populate("items.product");
};


const updateCartItem = async (userId, productId, quantity) => {
  const requestedQuantity = Number(quantity);

  if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
    const error = new Error("Quantity must be a positive whole number");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (requestedQuantity > product.stock) {
    const error = new Error("Requested quantity exceeds available stock");
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const item = cart.items.find(
    (cartItem) => cartItem.product.toString() === productId.toString()
  );

  if (!item) {
    const error = new Error("Product is not in the cart");
    error.statusCode = 404;
    throw error;
  }

  item.quantity = requestedQuantity;

  await cart.save();

  return await cart.populate("items.product");
};


const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId.toString()
  );

  if (!itemExists) {
    const error = new Error("Product is not in the cart");
    error.statusCode = 404;
    throw error;
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  await cart.save();

  return await cart.populate("items.product");
};


const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  cart.items = [];

  await cart.save();

  return cart;
};


module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};