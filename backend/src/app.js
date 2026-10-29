const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const passport = require('passport');

const documentRoutes = require('./routes/documentRoutes');
const authRoutes = require('./routes/authRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const googleRoutes = require('./routes/googleRoutes');
const { generalLimiter } = require('./middleware/rateLimiter');
require('./config/passport');

const app = express();

app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(generalLimiter);

// Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/documents', documentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;
