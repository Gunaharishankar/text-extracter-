/**
 * SMTP Test Script
 * Run: node src/scripts/testEmail.js
 */
require('dotenv').config();
const nodemailer = require('nodemailer');

async function testSmtp() {
    console.log('\n===== SMTP Configuration Check =====');
    console.log('SMTP_HOST:', process.env.SMTP_HOST || '❌ NOT SET');
    console.log('SMTP_PORT:', process.env.SMTP_PORT || '❌ NOT SET');
    console.log('SMTP_USER:', process.env.SMTP_USER || '❌ NOT SET');
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? '✅ SET (hidden)' : '❌ NOT SET');
    console.log('SMTP_FROM_NAME:', process.env.SMTP_FROM_NAME || '❌ NOT SET');
    console.log('SMTP_FROM_EMAIL:', process.env.SMTP_FROM_EMAIL || '❌ NOT SET (was EMAIL_FROM used by mistake?)');
    console.log('====================================\n');

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.error('❌ SMTP_USER or SMTP_PASS is missing. Cannot test.');
        process.exit(1);
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: parseInt(process.env.SMTP_PORT, 10) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // Step 1: Verify SMTP connection
    console.log('🔌 Step 1: Testing SMTP connection...');
    try {
        await transporter.verify();
        console.log('✅ SMTP connection successful!\n');
    } catch (err) {
        console.error('❌ SMTP connection FAILED:', err.message);
        console.error('\nPossible causes:');
        console.error('  - Wrong SMTP_HOST, SMTP_USER, or SMTP_PASS');
        console.error('  - Brevo: Your IP is not authorized (check Brevo dashboard > SMTP & API > Authorized IPs)');
        console.error('  - Gmail: You need a Google App Password, not your regular password');
        console.error('  - Firewall/antivirus blocking port 587\n');
        process.exit(1);
    }

    // Step 2: Send a test email
    const testTo = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
    const fromAddress = `"${process.env.SMTP_FROM_NAME || 'Test'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`;

    console.log(`📨 Step 2: Sending test email FROM: ${fromAddress} TO: ${testTo}`);
    try {
        const info = await transporter.sendMail({
            from: fromAddress,
            to: testTo,
            subject: 'Transformo Docs - SMTP Test ✅',
            text: 'If you received this email, your SMTP configuration is working correctly!',
            html: '<h2 style="color: #2563eb;">Transformo Docs</h2><p>If you received this email, your SMTP configuration is <strong>working correctly</strong>! 🎉</p>'
        });
        console.log('✅ Email sent successfully!');
        console.log('   Message ID:', info.messageId);
        console.log(`\n📬 Check the inbox of: ${testTo}\n`);
    } catch (err) {
        console.error('❌ Sending FAILED:', err.message);
        console.error('\nPossible causes:');
        console.error('  - SMTP_FROM_EMAIL is not a verified sender in Brevo');
        console.error('  - Brevo: Unauthorized IP (check Brevo dashboard)');
        console.error('  - Gmail: From address must match SMTP_USER\n');
    }

    process.exit(0);
}

testSmtp();
