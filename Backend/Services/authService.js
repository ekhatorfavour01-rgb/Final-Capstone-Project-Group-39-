const User = require('../Models/User');
const generateToken = require('../Utils/generateToken');

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const register = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
        throw createError('An account with this email already exists.', 409);
    }

    const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
    });

    return {
        user,
        token: generateToken(user.id, user.role),
    };
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    const passwordMatches = user && await user.comparePassword(password);

    if (!passwordMatches) {
        throw createError('Invalid email or password.', 401);
    }

    return {
        user,
        token: generateToken(user.id, user.role),
    };
};

const changePassword = async (userId, currentPassword, newPassword) => {

    const user = await User.findById(userId).select('+password');

    if (!user) {
        throw createError('User not found.', 404);
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
        throw createError('Current password is incorrect.', 400);
    }

    user.password = newPassword;
    await user.save();
}

module.exports = { register, login, changePassword };