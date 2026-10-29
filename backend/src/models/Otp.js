const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    otpHash: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ['email-verification', 'password-reset'],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    },
    attempts: {
        type: Number,
        default: 0,
        max: 5
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound index for querying user's active OTP for a purpose
otpSchema.index({ userId: 1, purpose: 1 });
// TTL index: auto-remove documents once expiresAt has passed
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

otpSchema.methods.compareOtp = async function (candidateOtp) {
    return await bcrypt.compare(candidateOtp, this.otpHash);
};

otpSchema.statics.generateNumericOtp = function () {
    // 6-digit numeric OTP padded with leading zeroes
    return Math.floor(100000 + Math.random() * 900000).toString();
};

otpSchema.statics.hashOtp = async function (otp) {
    return await bcrypt.hash(otp, 10);
};

module.exports = mongoose.model('Otp', otpSchema);
