const mongoose = require("mongoose");
const path = require("node:path");
const Product = require("../Models/Product");
const productCatalog = require("../data/productCatalog");
const { seedProductCatalog } = require("../Services/productSeedService");

// Resolve relative to this script, not the shell's current directory.
require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
    quiet: true,
});

const isLocalMongoUri = (uri) => {
    try {
        return ["localhost", "127.0.0.1", "::1"].includes(
            new URL(uri).hostname,
        );
    } catch {
        return false;
    }
};

const seedProducts = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error("MONGO_URI must be set before seeding products.");
    }

    if (
        !isLocalMongoUri(mongoUri) &&
        process.env.CONFIRM_REMOTE_PRODUCT_SEED !== "true"
    ) {
        throw new Error(
            "Refusing to seed a remote database. Set CONFIRM_REMOTE_PRODUCT_SEED=true only after verifying MONGO_URI targets the intended database.",
        );
    }

    await mongoose.connect(mongoUri);
    try {
        const result = await seedProductCatalog(Product, productCatalog);
        console.log(
            `Product catalog seed complete: ${result.inserted} inserted, ${result.existing} already present.`,
        );
        return result;
    } finally {
        await mongoose.disconnect();
    }
};

if (require.main === module) {
    seedProducts().catch((error) => {
        console.error("Product catalog seed failed:", error.message);
        process.exitCode = 1;
    });
}

module.exports = { isLocalMongoUri, seedProducts };
