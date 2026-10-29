const User = require('../models/User');
const tokenService = require('../services/tokenService');

const protect = async (req, res, next) => {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    const decoded = tokenService.verifyAccessToken(token);
    if (!decoded || !decoded.userId) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }

    try {
        const user = await User.findById(decoded.userId).select('-passwordHash');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User belonging to this token no longer exists.'
            });
        }
        req.user = user;
        next();
    } catch (err) {
        return next(err);
    }
};

const requireVerifiedEmail = (req, res, next) => {
    if (!req.user || !req.user.emailVerified) {
        return res.status(403).json({
            success: false,
            message: 'Email address must be verified to perform this action.'
        });
    }
    next();
};

module.exports = {
    protect,
    requireVerifiedEmail
};
