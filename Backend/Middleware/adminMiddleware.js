const { errorResponse } = require('../Utils/apiResponse');

const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return errorResponse(res, 403, "Access denied. Admins only.");
    }
    next();
};