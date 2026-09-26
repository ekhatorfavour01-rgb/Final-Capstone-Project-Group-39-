const Product = require("../Models/Product");

const getAllProducts = async ({
  search,
  category,
  page = 1,
  limit = 10,
}) => {
  const filter = {};

  // Search products by name
  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  // Filter products by category
  if (category) {
    filter.category = category;
  }

  const currentPage = Math.max(Number(page) || 1, 1);
  const pageSize = Math.max(Number(limit) || 10, 1);

  const skip = (currentPage - 1) * pageSize;

  const [products, totalRecords] = await Promise.all([
    Product.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 }),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      currentPage,
      pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
    },
  };
};


const getProductById = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};


const createProduct = async (data) => {
  return await Product.create(data);
};


const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};


const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};


module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};