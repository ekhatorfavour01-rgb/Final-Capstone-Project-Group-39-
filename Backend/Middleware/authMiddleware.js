const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../Config/env');
const { errorResponse } = require("../Utils/apiResponse");
const User = require('../Models/User');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 401, 'No token provided. Please log in.');
    }

    const token = authHeader.slice('Bearer '.length).trim();
    let decoded;

    try {
        decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return errorResponse(res, 401, 'Invalid or expired token.');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        return errorResponse(res, 401, 'User no longer exists.');
    }

    req.user = { id: user.id, role: user.role };
    return next();
};

module.exports = authMiddleware;