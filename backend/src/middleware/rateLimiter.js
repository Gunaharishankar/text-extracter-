const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per 15 min window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // Max 20 attempts per 15 min window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many login/registration attempts. Please try again after 15 minutes.'
    }
});

const otpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Max 5 OTP requests per 15 min window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many OTP requests. Please wait a few minutes before trying again.'
    }
});

const passwordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Max 5 password reset attempts per 15 min window
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many password reset requests. Please try again later.'
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    otpLimiter,
    passwordLimiter
};
