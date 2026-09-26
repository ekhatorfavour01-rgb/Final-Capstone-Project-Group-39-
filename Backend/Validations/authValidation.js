const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const validateRegister = (body) => {
    const errors = [];
    if (!isObject(body)) return ['Request body must be a JSON object.'];

    if (typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 80) {
        errors.push('Name must be between 2 and 80 characters.');
    }
    if (typeof body.email !== 'string' || body.email.length > 254 || !EMAIL_PATTERN.test(body.email.trim())) {
        errors.push('A valid email address is required.');
    }
    if (typeof body.password !== 'string' || body.password.length < 8 || body.password.length > 128) {
        errors.push('Password must be between 8 and 128 characters.');
    }
    if (Object.keys(body).some((key) => !['name', 'email', 'password'].includes(key))) {
        errors.push('Only name, email, and password may be provided.');
    }

    return errors;
};

const validateLogin = (body) => {
    const errors = [];
    if (!isObject(body)) return ['Request body must be a JSON object.'];

    if (typeof body.email !== 'string' || !EMAIL_PATTERN.test(body.email.trim())) {
        errors.push('A valid email address is required.');
    }
    if (typeof body.password !== 'string' || body.password.length === 0) {
        errors.push('Password is required.');
    }
    if (Object.keys(body).some((key) => !['email', 'password'].includes(key))) {
        errors.push('Only email and password may be provided.');
    }

    return errors;
};

const validateProfileUpdate = (body) => {
    const errors = [];
    if (!isObject(body)) return ['Request body must be a JSON object.'];

    const keys = Object.keys(body);
    if (keys.length === 0) errors.push('Provide at least one profile field to update.');
    if (keys.some((key) => !['name', 'email'].includes(key))) {
        errors.push('Only name and email may be updated.');
    }
    if (Object.hasOwn(body, 'name') &&
        (typeof body.name !== 'string' || body.name.trim().length < 2 || body.name.trim().length > 80)) {
        errors.push('Name must be between 2 and 80 characters.');
    }
    if (Object.hasOwn(body, 'email') &&
        (typeof body.email !== 'string' || body.email.length > 254 || !EMAIL_PATTERN.test(body.email.trim()))) {
        errors.push('A valid email address is required.');
    }

    return errors;
};

module.exports = { validateRegister, validateLogin, validateProfileUpdate };