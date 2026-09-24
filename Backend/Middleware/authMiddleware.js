const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../Config/env');
const { errorResponse } = require("../Utils/apiResponse");
const user = require('../Models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return errorResponse(res, 401, 'No token provided. Please log in');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);


        // Confirm the user still exists in the database
        const user = await user.findById(decoded.id);
        if (!user) {
            return errorResponse(res, 401, 'User no longer exists.');
        }

        req.user = { id: user._id, role: user.role}
        next();
    } catch (error) {
        return errorResponse(res, 401, 'Invalid or expired token.');
    }
};

module.exports = authMiddleware;