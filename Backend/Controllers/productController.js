const productService = require("../Services/productService");
const { successResponse } = require("../Utils/apiResponse");

const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      page,
      limit,
    } = req.query;

    const result = await productService.getAllProducts({
      search,
      category,
      page,
      limit,
    });

    return successResponse(
      res,
      200,
      "Products fetched successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};


const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(
      req.params.id
    );

    return successResponse(
      res,
      200,
      "Product fetched successfully",
      product
    );
  } catch (error) {
    next(error);
  }
};


const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(
      req.body
    );

    return successResponse(
      res,
      201,
      "Product created successfully",
      product
    );
  } catch (error) {
    next(error);
  }
};


const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.body
    );

    return successResponse(
      res,
      200,
      "Product updated successfully",
      product
    );
  } catch (error) {
    next(error);
  }
};


const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(
      req.params.id
    );

    return successResponse(
      res,
      200,
      "Product deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
