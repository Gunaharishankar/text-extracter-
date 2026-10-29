const passport = require('passport');
const tokenService = require('../services/tokenService');

exports.initiateGoogleAuth = (req, res, next) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.redirect(`${clientUrl}/login?error=google_not_configured`);
    }

    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })(req, res, next);
};

exports.googleCallback = (req, res, next) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err || !user) {
            console.error('Google OAuth callback error:', err || info);
            return res.redirect(`${clientUrl}/login?error=google_auth_failed`);
        }

        const accessToken = tokenService.generateAccessToken(user);
        const refreshToken = tokenService.generateRefreshToken(user);

        res.cookie('refreshToken', refreshToken, tokenService.getRefreshTokenCookieOptions());

        res.redirect(`${clientUrl}/auth/google/callback?accessToken=${accessToken}`);
    })(req, res, next);
};
