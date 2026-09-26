const express = require('express');
const router = express.Router();

const { register, login } = require('../Controllers/authController');
const validate = require('../Middleware/validateMiddleware');
const { validateRegister, validateLogin } = require('../Validations/authValidation');

router.post('/register', validate(validateRegister), register);
router.post('/login', validate(validateLogin), login);

module.exports = router;