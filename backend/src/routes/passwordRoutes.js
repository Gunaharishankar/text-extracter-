const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/passwordController');
const { protect } = require('../middleware/authMiddleware');
const { passwordLimiter } = require('../middleware/rateLimiter');
const {
    validateForgotPassword,
    validateVerifyResetOtp,
    validateResetPassword,
    validateChangePassword
} = require('../utils/validators');

router.post('/forgot-password', passwordLimiter, validateForgotPassword, passwordController.forgotPassword);
router.post('/verify-reset-otp', passwordLimiter, validateVerifyResetOtp, passwordController.verifyResetOtp);
router.post('/reset-password', passwordLimiter, validateResetPassword, passwordController.resetPassword);
router.post('/change-password', protect, validateChangePassword, passwordController.changePassword);

module.exports = router;
