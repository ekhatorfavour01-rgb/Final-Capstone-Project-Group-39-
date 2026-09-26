const authService = require('../Services/authService');
const { successResponse } = require('../Utils/apiResponse');

const register = async (req, res) => {
    const result = await authService.register(req.body);
    return successResponse(res, 201, 'Account created successfully.', result);
};

const login = async (req, res) => {
    const result = await authService.login(req.body);
    return successResponse(res, 200, 'Logged in successfully.', result);
};

module.exports = { register, login };