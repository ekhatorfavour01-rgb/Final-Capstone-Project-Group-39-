const Product = require("../Models/Product");
const {
    validateProduct,
    validateProductUpdate,
} = require("../Validations/productValidation");

const completeProduct = {
    name: "Catalog Test Product",
    brand: "Test Brand",
    description: "Description",
    price: 99.99,
    oldPrice: 119.99,
    discount: "17% OFF",
    stock: 10,
    category: "Electronics",
    color: "black",
    rating: 4.5,
    badge: "New",
    image: "https://example.com/product.jpg",
};

describe("expanded product catalog fields", () => {
    test("accepts and stores the storefront catalog metadata", async () => {
        expect(validateProduct(completeProduct)).toEqual([]);

        const product = new Product(completeProduct);
        await expect(product.validate()).resolves.toBeUndefined();
        expect(product.toObject()).toMatchObject(completeProduct);
        expect(product.stock).toBe(10);

        const invalidStock = new Product({ ...completeProduct, stock: 1.5 });
        await expect(invalidStock.validate()).rejects.toHaveProperty(
            "errors.stock",
        );
    });

    test("allows partial metadata updates and rejects invalid values", () => {
        expect(validateProductUpdate({ badge: "New", rating: 4.2 })).toEqual(
            [],
        );
        expect(validateProductUpdate({ rating: 5.1 })).toContain(
            "rating must not exceed 5",
        );
        expect(validateProductUpdate({ stock: 1.5 })).toContain(
            "stock must be a whole number",
        );
        expect(validateProductUpdate({ name: "  " })).toContain(
            "name is required",
        );
        expect(validateProductUpdate({ category: "  " })).toContain(
            "category is required",
        );
        expect(validateProductUpdate({ inCart: true })).toContain(
            "Product contains unsupported fields",
        );
    });
});
