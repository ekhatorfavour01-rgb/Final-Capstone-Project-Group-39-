const seedProductCatalog = async (Product, catalog) => {
    let inserted = 0;
    let existing = 0;

    for (const product of catalog) {
        const seedDocument = {
            ...product,
            description: product.description || "",
            stock: product.stock ?? 10,
        };
        // Product names are stable in the mock catalog. Matching by name
        // also avoids duplicating legacy records that predate the brand field.
        const result = await Product.updateOne(
            { name: seedDocument.name },
            { $setOnInsert: seedDocument },
            { upsert: true },
        );

        if (result.upsertedCount) inserted += 1;
        else existing += 1;
    }

    return { inserted, existing };
};

module.exports = { seedProductCatalog };
