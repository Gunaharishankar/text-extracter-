const Otp = require('../models/Otp');
const emailService = require('./emailService');

class OtpService {
    async generateAndSendOtp(user, purpose) {
        // Cooldown check (60 seconds)
        const recentOtp = await Otp.findOne({
            userId: user._id,
            purpose
        }).sort({ createdAt: -1 });

        if (recentOtp) {
            const timeSinceLastOtp = (Date.now() - new Date(recentOtp.createdAt).getTime()) / 1000;
            const cooldownSeconds = 60;
            if (timeSinceLastOtp < cooldownSeconds) {
                const waitSeconds = Math.ceil(cooldownSeconds - timeSinceLastOtp);
                throw new Error(`Please wait ${waitSeconds} seconds before requesting a new OTP.`);
            }
        }

        // Delete any existing OTPs for this user and purpose
        await Otp.deleteMany({ userId: user._id, purpose });

        // Generate 6-digit OTP
        const plainOtp = Otp.generateNumericOtp();
        const otpHash = await Otp.hashOtp(plainOtp);

        // Save OTP
        await Otp.create({
            userId: user._id,
            email: user.email,
            otpHash,
            purpose,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            attempts: 0,
            verified: false
        });

        // Dispatch email
        if (purpose === 'email-verification') {
            await emailService.sendVerificationOtp(user.email, user.name, plainOtp);
        } else if (purpose === 'password-reset') {
            await emailService.sendPasswordResetOtp(user.email, user.name, plainOtp);
        }

        return { success: true };
    }

    async verifyOtp(userId, purpose, candidateOtp) {
        const otpRecord = await Otp.findOne({
            userId,
            purpose,
            expiresAt: { $gt: new Date() }
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return {
                valid: false,
                reason: 'OTP has expired or is invalid. Please request a new one.'
            };
        }

        if (otpRecord.attempts >= 5) {
            await Otp.deleteOne({ _id: otpRecord._id });
            return {
                valid: false,
                reason: 'Too many incorrect attempts. Please request a new OTP.'
            };
        }

        const isMatch = await otpRecord.compareOtp(candidateOtp);
        if (!isMatch) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            const remaining = 5 - otpRecord.attempts;
            return {
                valid: false,
                reason: `Incorrect OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
            };
        }

        // Mark verified and clean up
        otpRecord.verified = true;
        await Otp.deleteMany({ userId, purpose });

        return { valid: true };
    }
}

module.exports = new OtpService();
