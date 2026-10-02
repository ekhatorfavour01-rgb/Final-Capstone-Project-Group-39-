const productCatalog = require("../data/productCatalog");
const { seedProductCatalog } = require("../Services/productSeedService");
const { isLocalMongoUri } = require("../scripts/seedProducts");

describe("product catalog seed", () => {
    test("contains the 40 mock products without frontend IDs", () => {
        expect(productCatalog).toHaveLength(40);
        expect(
            productCatalog.every((product) => product.id === undefined),
        ).toBe(true);
        expect(
            new Set(productCatalog.map(({ name, brand }) => `${name}|${brand}`))
                .size,
        ).toBe(40);
    });

    test("inserts missing products with stock 10 and leaves existing records alone", async () => {
        const product = productCatalog[0];
        const Product = {
            updateOne: jest
                .fn()
                .mockResolvedValueOnce({ upsertedCount: 1 })
                .mockResolvedValueOnce({ upsertedCount: 0 }),
        };

        await expect(seedProductCatalog(Product, [product])).resolves.toEqual({
            inserted: 1,
            existing: 0,
        });
        await expect(seedProductCatalog(Product, [product])).resolves.toEqual({
            inserted: 0,
            existing: 1,
        });

        expect(Product.updateOne).toHaveBeenNthCalledWith(
            1,
            { name: product.name },
            {
                $setOnInsert: {
                    ...product,
                    description: "",
                    stock: 10,
                },
            },
            { upsert: true },
        );
    });

    test("classifies local Mongo URIs without exposing their contents", () => {
        expect(isLocalMongoUri("mongodb://127.0.0.1:27017/project39")).toBe(
            true,
        );
        expect(
            isLocalMongoUri(
                "mongodb+srv://cluster.example.mongodb.net/project39",
            ),
        ).toBe(false);
    });
});
