const User = require('../Models/User');
const { successResponse } = require('../Utils/apiResponse');

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const getProfile = async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) throw createError('User not found.', 404);

    return successResponse(res, 200, 'Profile retrieved successfully.', user);
};

const updateProfile = async (req, res) => {
    const updates = {};
    if (Object.hasOwn(req.body, 'name')) updates.name = req.body.name.trim();
    if (Object.hasOwn(req.body, 'email')) updates.email = req.body.email.trim().toLowerCase();

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
        returnDocument: 'after',
        runValidators: true,
    });
    if (!user) throw createError('User not found.', 404);

    return successResponse(res, 200, 'Profile updated successfully.', user);
};

module.exports = { getProfile, updateProfile };