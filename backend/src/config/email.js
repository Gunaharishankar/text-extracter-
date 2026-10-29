const nodemailer = require('nodemailer');

const createTransporter = () => {
    const hasSmtpConfig = process.env.SMTP_USER && process.env.SMTP_PASS;

    if (!hasSmtpConfig) {
        console.warn('⚠️ SMTP credentials not fully configured in .env. Emails will be logged to console.');
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT, 10) || 587,
        secure: parseInt(process.env.SMTP_PORT, 10) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

const transporter = createTransporter();

module.exports = transporter;
