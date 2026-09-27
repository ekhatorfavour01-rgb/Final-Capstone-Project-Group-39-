const express = require('express');
const router = express.Router();

const { getProfile, updateProfile, changePassword } = require('../Controllers/userController');
const authMiddleware = require('../Middleware/authMiddleware');
const validate = require('../Middleware/validateMiddleware');
const { validateProfileUpdate } = require('../Validations/authValidation');

router.get('/me', authMiddleware, getProfile);
router.patch('/me', authMiddleware, validate(validateProfileUpdate), updateProfile);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;