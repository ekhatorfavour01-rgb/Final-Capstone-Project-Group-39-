const validateProduct = (body) => {
  const errors = [];

  const { name, price, stock, category } = body;

  if (!name || name.trim().length === 0) {
    errors.push("Product name is required");
  }

  if (
    price === undefined ||
    price === null ||
    price === "" ||
    Number.isNaN(Number(price)) ||
    Number(price) < 0
  ) {
    errors.push("Price must be a number greater than or equal to 0");
  }

  if (
    stock === undefined ||
    stock === null ||
    stock === "" ||
    Number.isNaN(Number(stock)) ||
    Number(stock) < 0
  ) {
    errors.push("Stock must be a number greater than or equal to 0");
  }

  if (!category || category.trim().length === 0) {
    errors.push("Category is required");
  }

  return errors;
};

module.exports = {
  validateProduct,
};