const isObject = (value) =>
    value !== null && typeof value === "object" && !Array.isArray(value);

const textFields = [
    "name",
    "brand",
    "description",
    "discount",
    "category",
    "color",
    "badge",
    "image",
];
const numericFields = ["price", "oldPrice", "stock", "rating"];
const allowedFields = new Set([...textFields, ...numericFields]);

const validateProductFields = (body, requiredFields) => {
    const errors = [];
    if (!isObject(body)) return ["Request body must be a JSON object"];

    if (Object.keys(body).some((key) => !allowedFields.has(key))) {
        errors.push("Product contains unsupported fields");
    }

    for (const field of textFields) {
        if (!Object.hasOwn(body, field)) {
            if (requiredFields.has(field)) errors.push(`${field} is required`);
            continue;
        }
        if (typeof body[field] !== "string") {
            errors.push(`${field} must be a string`);
        } else if (
            (requiredFields.has(field) ||
                field === "name" ||
                field === "category") &&
            body[field].trim().length === 0
        ) {
            errors.push(`${field} is required`);
        }
    }

    for (const field of numericFields) {
        if (!Object.hasOwn(body, field)) {
            if (requiredFields.has(field)) errors.push(`${field} is required`);
            continue;
        }
        const rawValue = body[field];
        const value = Number(rawValue);
        if (
            rawValue === null ||
            rawValue === "" ||
            typeof rawValue === "boolean" ||
            !Number.isFinite(value) ||
            value < 0
        ) {
            errors.push(`${field} must be a number greater than or equal to 0`);
        } else if (field === "stock" && !Number.isInteger(value)) {
            errors.push("stock must be a whole number");
        } else if (field === "rating" && value > 5) {
            errors.push("rating must not exceed 5");
        }
    }

    return errors;
};

const validateProduct = (body) =>
    validateProductFields(
        body,
        new Set(["name", "price", "stock", "category"]),
    );

const validateProductUpdate = (body) => {
    if (!isObject(body) || Object.keys(body).length === 0) {
        return ["Provide at least one product field to update"];
    }
    return validateProductFields(body, new Set());
};

module.exports = {
    validateProduct,
    validateProductUpdate,
};
