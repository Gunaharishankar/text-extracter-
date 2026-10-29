const User = require('../models/User');
const tokenService = require('../services/tokenService');
const otpService = require('../services/otpService');
const emailService = require('../services/emailService');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            if (existingUser.emailVerified) {
                return res.status(409).json({
                    success: false,
                    message: 'An account with this email address already exists. Please log in.'
                });
            }

            // User registered previously but did not verify email:
            // Update password & name, resend verification OTP
            existingUser.name = name;
            existingUser.passwordHash = password; // Pre-save hook will hash it
            await existingUser.save();

            await otpService.generateAndSendOtp(existingUser, 'email-verification');

            return res.status(200).json({
                success: true,
                message: 'Account updated. A verification code has been sent to your email.',
                email: existingUser.email
            });
        }

        const newUser = new User({
            name,
            email,
            passwordHash: password, // Pre-save hook hashes it
            authProvider: 'local',
            emailVerified: false
        });

        await newUser.save();
        await otpService.generateAndSendOtp(newUser, 'email-verification');

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email for the verification code.',
            email: newUser.email
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user account found with this email address.'
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email address is already verified. You can proceed to log in.'
            });
        }

        const verifyResult = await otpService.verifyOtp(user._id, 'email-verification', otp);
        if (!verifyResult.valid) {
            return res.status(400).json({
                success: false,
                message: verifyResult.reason
            });
        }

        user.emailVerified = true;

        if (!user.welcomeEmailSent) {
            await emailService.sendWelcomeEmail(user.email, user.name);
            user.welcomeEmailSent = true;
        }

        await user.save();

        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = tokenService.generateRefreshToken(user);

        res.cookie('refreshToken', refreshToken, tokenService.getRefreshTokenCookieOptions());

        res.status(200).json({
            success: true,
            message: 'Email verified successfully!',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                emailVerified: user.emailVerified
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.resendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with this email address.'
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email address is already verified.'
            });
        }

        await otpService.generateAndSendOtp(user, 'email-verification');

        res.status(200).json({
            success: true,
            message: 'A new verification code has been sent to your email.'
        });
    } catch (error) {
        if (error.message.includes('Please wait')) {
            return res.status(429).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        if (user.authProvider === 'google') {
            return res.status(400).json({
                success: false,
                message: 'This account is linked with Google. Please use "Continue with Google".'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        if (!user.emailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email address before logging in.',
                emailVerified: false,
                email: user.email
            });
        }

        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = tokenService.generateRefreshToken(user);

        res.cookie('refreshToken', refreshToken, tokenService.getRefreshTokenCookieOptions());

        res.status(200).json({
            success: true,
            message: 'Logged in successfully.',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                emailVerified: user.emailVerified
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res) => {
    res.clearCookie('refreshToken', tokenService.getRefreshTokenCookieOptions());
    res.status(200).json({
        success: true,
        message: 'Logged out successfully.'
    });
};

exports.getMe = (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            authProvider: req.user.authProvider,
            profileImage: req.user.profileImage,
            emailVerified: req.user.emailVerified
        }
    });
};

exports.refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'No refresh token provided.'
            });
        }

        const decoded = tokenService.verifyRefreshToken(refreshToken);
        if (!decoded || !decoded.userId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token.'
            });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists.'
            });
        }

        const newAccessToken = tokenService.generateAccessToken(user);
        const newRefreshToken = tokenService.generateRefreshToken(user);

        res.cookie('refreshToken', newRefreshToken, tokenService.getRefreshTokenCookieOptions());

        res.status(200).json({
            success: true,
            accessToken: newAccessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                emailVerified: user.emailVerified
            }
        });
    } catch (error) {
        next(error);
    }
};
