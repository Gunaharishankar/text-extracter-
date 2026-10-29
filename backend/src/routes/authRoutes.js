const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');
const {
    validateRegister,
    validateLogin,
    validateVerifyEmail,
    validateResendOtp
} = require('../utils/validators');

router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/verify-email', authLimiter, validateVerifyEmail, authController.verifyEmail);
router.post('/resend-otp', otpLimiter, validateResendOtp, authController.resendOtp);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/logout', authController.logout);
router.get('/me', protect, authController.getMe);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
