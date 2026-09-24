const { errorResponse } = require('../Utils/apiResponse');

const validate = (validationFn) => {
    return (req, res, next) => {
        const errors = validationFn(req.body);

        if (errors.length > 0) {
            return errorResponse(res, 400, errors.join(', '));
        }
        next();
    };
};

module.exports = validate;