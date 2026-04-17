const router = require('express').Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
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
    console.error('SMTP Connection Failed:', error.message);
  } else {
    console.log('SMTP Server is ready');
  }
});

const sanitize = (str) =>
  String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();

router.post('/send', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email address!' });
    }

    const safeName    = sanitize(name);
    const safeEmail   = sanitize(email);
    const safeSubject = sanitize(subject || 'No subject');
    const safeMessage = sanitize(message);

    const emailPromise = transporter.sendMail({
      from: `TradeEmpire <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_FROM,
      replyTo: safeEmail,
      subject: `TradeEmpire Contact: ${safeSubject} — from ${safeName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; background: #f8fafc; padding: 32px; border-radius: 16px;">
          <h2 style="color: #0891b2; margin-bottom: 8px;">📈 TradeEmpire — New Contact Message</h2>
          <hr style="border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #fff; padding: 16px; border-radius: 10px; border-left: 4px solid #0891b2; margin-top: 8px;">
            <p style="margin: 0; line-height: 1.7;">${safeMessage}</p>
          </div>
          <hr style="border: 1px solid #e2e8f0; margin-top: 24px;">
          <p style="color: #94a3b8; font-size: 12px;">Sent from TradeEmpire Contact Form</p>
        </div>
      `
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Email timeout')), 15000)
    );

    await Promise.race([emailPromise, timeoutPromise]);

    res.json({ message: 'Message sent successfully! We will get back to you soon.' });

  } catch (err) {
    console.error('Contact Email Error:', err.message);

    if (err.message.includes('timeout')) {
      return res.status(504).json({ message: 'Email server timed out. Please try again.' });
    }

    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;