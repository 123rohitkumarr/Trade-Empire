const nodemailer = require('nodemailer');

const hasSmtpConfig = Boolean(
  process.env.EMAIL_HOST &&
  process.env.EMAIL_USER &&
  process.env.EMAIL_PASS
);

let transporter = null;

if (hasSmtpConfig) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000
  });

  transporter.verify((error) => {
    if (error) {
      console.warn('⚠️ SMTP Connection Failed:', error.message);
    } else {
      console.log('✅ SMTP Server is ready to send emails');
    }
  });
} else {
  console.info('ℹ️ SMTP credentials not configured. Outgoing emails will be logged to console in development.');
}

const sendOTPEmail = async (email, name, otp) => {
  if (!transporter) {
    console.log(`[DEV EMAIL MOCK] OTP for ${email} (${name}): ${otp}`);
    return { success: true, mocked: true };
  }

  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@tradeempire.com';

  return transporter.sendMail({
    from: `TradeEmpire <${fromAddress}>`,
    to: email,
    subject: '👑 TradeEmpire — Verify Your Email',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: auto; background: #0f172a; padding: 40px; border-radius: 20px; color: #fff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #22d3ee; font-size: 28px; margin: 0;">📈 TradeEmpire 👑</h1>
          <p style="color: #64748b; margin-top: 8px;">Professional Trading Platform</p>
        </div>
        <h2 style="color: #fff; font-size: 22px; margin-bottom: 12px;">Welcome, ${name}! 🎉</h2>
        <p style="color: #94a3b8; line-height: 1.7; margin-bottom: 24px;">Thanks for joining TradeEmpire! Use the OTP below to verify your email and start your trading journey.</p>
        <div style="background: linear-gradient(135deg, rgba(34,211,238,0.12), rgba(129,140,248,0.12)); border: 1px solid rgba(34,211,238,0.25); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="color: #94a3b8; font-size: 13px; margin-bottom: 8px;">Your OTP Code</p>
          <h1 style="color: #22d3ee; font-size: 48px; letter-spacing: 12px; margin: 0;">${otp}</h1>
          <p style="color: #64748b; font-size: 12px; margin-top: 12px;">⏰ Valid for 10 minutes only</p>
        </div>
        <p style="color: #475569; font-size: 13px; text-align: center;">If you didn't register on TradeEmpire, you can safely ignore this email.</p>
        <hr style="border: 1px solid #1e293b; margin: 24px 0;">
        <p style="color: #334155; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} TradeEmpire 👑 · All rights reserved</p>
      </div>
    `
  });
};

const sendContactEmail = async ({ name, email, subject, message }) => {
  if (!transporter) {
    console.log(`[DEV EMAIL MOCK] Contact from ${name} <${email}>: ${subject} - ${message}`);
    return { success: true, mocked: true };
  }

  const destination = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  return transporter.sendMail({
    from: `TradeEmpire <${fromAddress}>`,
    to: destination,
    replyTo: email,
    subject: `TradeEmpire Contact: ${subject} — from ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; background: #f8fafc; padding: 32px; border-radius: 16px;">
        <h2 style="color: #0891b2; margin-bottom: 8px;">📈 TradeEmpire — New Contact Message</h2>
        <hr style="border: 1px solid #e2e8f0; margin-bottom: 24px;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #fff; padding: 16px; border-radius: 10px; border-left: 4px solid #0891b2; margin-top: 8px;">
          <p style="margin: 0; line-height: 1.7;">${message}</p>
        </div>
        <hr style="border: 1px solid #e2e8f0; margin-top: 24px;">
        <p style="color: #94a3b8; font-size: 12px;">Sent from TradeEmpire Contact Form</p>
      </div>
    `
  });
};

module.exports = {
  sendOTPEmail,
  sendContactEmail
};

