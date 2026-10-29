const transporter = require('../config/email');

class EmailService {
    getFromAddress() {
        const fromName = process.env.SMTP_FROM_NAME || 'Transformo Docs';
        const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@transformodocs.com';
        return `"${fromName}" <${fromEmail}>`;
    }

    async sendMail({ to, subject, text, html }) {
        if (!transporter) {
            console.log('\n=========================================');
            console.log(`📨 [DEV EMAIL SIMULATOR]`);
            console.log(`To: ${to}`);
            console.log(`Subject: ${subject}`);
            console.log(`Body (Text): \n${text}`);
            console.log('=========================================\n');
            return { messageId: 'simulated-dev-id' };
        }

        try {
            const info = await transporter.sendMail({
                from: this.getFromAddress(),
                to,
                subject,
                text,
                html
            });
            return info;
        } catch (error) {
            console.error(`Failed to send email to ${to}:`, error.message);
            // Do not break the request flow if SMTP fails in dev
            return null;
        }
    }

    async sendVerificationOtp(email, name, otp) {
        const subject = 'Verify your email address';
        const text = `Hello ${name},\n\nYour Transformo Docs email verification code is: ${otp}\nThis code will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #2563eb; margin-top: 0;">Transformo Docs</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
                <div style="background-color: #f1f5f9; padding: 16px; border-radius: 6px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1e293b; margin: 20px 0;">
                    ${otp}
                </div>
                <p style="color: #64748b; font-size: 14px;">This code is valid for <strong>10 minutes</strong>. Never share this code with anyone.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">If you did not create an account on Transformo Docs, please ignore this email.</p>
            </div>
        `;

        return await this.sendMail({ to: email, subject, text, html });
    }

    async sendWelcomeEmail(email, name) {
        const subject = 'Welcome to Transformo Docs!';
        const text = `Hello ${name},\n\nWelcome to Transformo Docs! Your account has been verified successfully.\n\nYou can now upload documents (PDF, DOCX, Images, etc.) and extract machine-readable text using Apache Tika and Tesseract OCR.\n\nBest regards,\nThe Transformo Docs Team`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #2563eb; margin-top: 0;">Welcome to Transformo Docs 🎉</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Your account has been successfully verified! You're ready to start extracting text from documents seamlessly.</p>
                <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 12px; margin: 16px 0;">
                    <p style="margin: 0; color: #1e40af; font-size: 14px;">
                        <strong>Supported file types:</strong> PDF, DOCX, PPTX, XLSX, TXT, and scanned images (PNG, JPG) with high-accuracy Tesseract OCR.
                    </p>
                </div>
                <p>All your uploaded documents and extractions will be securely stored under your personal account.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">Transformo Docs &bull; Smart Document Text Extraction</p>
            </div>
        `;

        return await this.sendMail({ to: email, subject, text, html });
    }

    async sendPasswordResetOtp(email, name, otp) {
        const subject = 'Password reset request';
        const text = `Hello ${name},\n\nWe received a request to reset your password for your Transformo Docs account.\n\nYour reset code is: ${otp}\nThis code will expire in 10 minutes.\n\nIf you did not make this request, you can safely ignore this email.`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #2563eb; margin-top: 0;">Transformo Docs</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>We received a request to reset the password for your Transformo Docs account. Use the code below to proceed with resetting your password:</p>
                <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 6px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #b91c1c; margin: 20px 0;">
                    ${otp}
                </div>
                <p style="color: #64748b; font-size: 14px;">This code will expire in <strong>10 minutes</strong>. If you did not request a password reset, please secure your account immediately.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">Transformo Docs Security Team</p>
            </div>
        `;

        return await this.sendMail({ to: email, subject, text, html });
    }

    async sendPasswordChangedConfirmation(email, name) {
        const subject = 'Your password has been changed';
        const text = `Hello ${name},\n\nThis is a confirmation that the password for your Transformo Docs account has recently been changed.\n\nIf you did not make this change, please contact support or reset your password immediately.`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #2563eb; margin-top: 0;">Transformo Docs</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>Your password was successfully updated.</p>
                <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px; margin: 16px 0;">
                    <p style="margin: 0; color: #15803d; font-size: 14px;">
                        If you made this change, no further action is required.
                    </p>
                </div>
                <p style="color: #ef4444; font-size: 14px;">If you did NOT perform this action, please reset your password immediately to protect your account.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">Transformo Docs Security Team</p>
            </div>
        `;

        return await this.sendMail({ to: email, subject, text, html });
    }
}

module.exports = new EmailService();
