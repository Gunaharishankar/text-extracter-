const jwt = require('jsonwebtoken');

class TokenService {
    getAccessSecret() {
        return process.env.JWT_ACCESS_SECRET || 'default_dev_access_secret_change_in_prod';
    }

    getRefreshSecret() {
        return process.env.JWT_REFRESH_SECRET || 'default_dev_refresh_secret_change_in_prod';
    }

    generateAccessToken(user) {
        return jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email
            },
            this.getAccessSecret(),
            { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
        );
    }

    generateRefreshToken(user) {
        return jwt.sign(
            {
                userId: user._id.toString()
            },
            this.getRefreshSecret(),
            { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
        );
    }

    generatePasswordResetToken(user) {
        return jwt.sign(
            {
                userId: user._id.toString(),
                purpose: 'password-reset'
            },
            this.getAccessSecret(),
            { expiresIn: '15m' }
        );
    }

    verifyAccessToken(token) {
        try {
            return jwt.verify(token, this.getAccessSecret());
        } catch (err) {
            return null;
        }
    }

    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, this.getRefreshSecret());
        } catch (err) {
            return null;
        }
    }

    verifyPasswordResetToken(token) {
        try {
            const decoded = jwt.verify(token, this.getAccessSecret());
            if (decoded.purpose !== 'password-reset') return null;
            return decoded;
        } catch (err) {
            return null;
        }
    }

    getRefreshTokenCookieOptions() {
        const isProduction = process.env.NODE_ENV === 'production';
        return {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in ms
        };
    }
}

module.exports = new TokenService();
