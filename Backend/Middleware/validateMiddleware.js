const { errorResponse } = require('../Utils/apiResponse');

const validate = (validationFn) => {
    return (req, res, next) => {
        if (typeof req.body === 'undefined') {
            return errorResponse(
                res,
                400,
                'Request body is missing or could not be parsed. Send JSON with Content-Type: application/json.'
            );
        }

        const errors = validationFn(req.body);

        if (errors.length > 0) {
            return errorResponse(res, 400, errors.join(', '));
        }
        next();
    };
};

module.exports = validate;