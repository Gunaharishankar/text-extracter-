const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const emailService = require('../services/emailService');

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/google/continue',
        passReqToCallback: true
    }, async (req, accessToken, refreshToken, profile, done) => {
        try {
            const googleId = profile.id;
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null;
            const name = profile.displayName || (profile.name ? `${profile.name.givenName || ''} ${profile.name.familyName || ''}`.trim() : 'Google User');
            const profileImage = profile.photos && profile.photos[0] ? profile.photos[0].value : '';

            if (!email) {
                return done(new Error('No email found in Google profile'), null);
            }

            // 1. Check if user already exists with this googleId
            let user = await User.findOne({ googleId });
            if (user) {
                return done(null, user);
            }

            // 2. Check if user with this email exists (e.g. registered with email/password)
            user = await User.findOne({ email });
            if (user) {
                user.googleId = googleId;
                user.emailVerified = true;
                if (!user.profileImage && profileImage) {
                    user.profileImage = profileImage;
                }
                await user.save();
                return done(null, user);
            }

            // 3. New Google user
            user = new User({
                name,
                email,
                authProvider: 'google',
                googleId,
                emailVerified: true,
                profileImage,
                welcomeEmailSent: false
            });

            await user.save();

            emailService.sendWelcomeEmail(email, name).catch(err => {
                console.error('Welcome email dispatch error:', err.message);
            });
            user.welcomeEmailSent = true;
            await user.save();

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }));
} else {
    console.warn('⚠️ Google OAuth credentials not configured in .env. Google login disabled until credentials are provided.');
}

module.exports = passport;
