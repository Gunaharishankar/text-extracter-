const User = require('../models/User');
const tokenService = require('../services/tokenService');
const otpService = require('../services/otpService');
const emailService = require('../services/emailService');

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const genericMessage = 'If an account with that email exists, a password reset code has been sent.';

        const user = await User.findOne({ email });
        if (!user || user.authProvider === 'google') {
            // Constant response prevents email enumeration
            return res.status(200).json({
                success: true,
                message: genericMessage
            });
        }

        await otpService.generateAndSendOtp(user, 'password-reset');

        res.status(200).json({
            success: true,
            message: genericMessage,
            email: user.email
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

exports.verifyResetOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or reset code.'
            });
        }

        const verifyResult = await otpService.verifyOtp(user._id, 'password-reset', otp);
        if (!verifyResult.valid) {
            return res.status(400).json({
                success: false,
                message: verifyResult.reason
            });
        }

        const resetToken = tokenService.generatePasswordResetToken(user);

        res.status(200).json({
            success: true,
            message: 'Code verified successfully. You may now set a new password.',
            resetToken
        });
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;

        const decoded = tokenService.verifyPasswordResetToken(resetToken);
        if (!decoded || !decoded.userId) {
            return res.status(400).json({
                success: false,
                message: 'Password reset session is invalid or has expired. Please request a new code.'
            });
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User account not found.'
            });
        }

        user.passwordHash = newPassword; // Pre-save hook hashes this
        await user.save();

        await emailService.sendPasswordChangedConfirmation(user.email, user.name);

        res.status(200).json({
            success: true,
            message: 'Your password has been reset successfully. Please log in with your new password.'
        });
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        if (user.authProvider === 'google') {
            return res.status(400).json({
                success: false,
                message: 'Google accounts do not use a password. Password change is not supported.'
            });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password does not match.'
            });
        }

        user.passwordHash = newPassword; // Pre-save hook hashes this
        await user.save();

        await emailService.sendPasswordChangedConfirmation(user.email, user.name);

        res.status(200).json({
            success: true,
            message: 'Password changed successfully.'
        });
    } catch (error) {
        next(error);
    }
};
