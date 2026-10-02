const authService = require("../Services/authService");
const auditService = require("../Services/auditService");
const { successResponse } = require("../Utils/apiResponse");

const register = async (req, res) => {
    const result = await authService.register(req.body);
    await auditService.recordEvent({
        actorId: result.user.id,
        action: "user.registered",
        targetType: "user",
        targetId: result.user.id,
    });
    return successResponse(res, 201, "Account created successfully.", result);
};

const login = async (req, res) => {
    const result = await authService.login(req.body);
    await auditService.recordEvent({
        actorId: result.user.id,
        action: "user.logged_in",
        targetType: "user",
        targetId: result.user.id,
    });
    return successResponse(res, 200, "Logged in successfully.", result);
};

module.exports = { register, login };
