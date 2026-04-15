
const router = require('express').Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/send', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `TradeEmpire Contact: ${subject || 'New Message'} — from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; background: #f8fafc; padding: 32px; border-radius: 16px;">
          <h2 style="color: #0891b2; margin-bottom: 8px;">📈 TradeEmpire — New Contact Message</h2>
          <hr style="border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #fff; padding: 16px; border-radius: 10px; border-left: 4px solid #0891b2; margin-top: 8px;">
            <p>${message}</p>
          </div>
          <hr style="border: 1px solid #e2e8f0; margin-top: 24px;">
          <p style="color: #94a3b8; font-size: 12px;">Sent from TradeEmpire Contact Form</p>
        </div>
      `
    });

    res.json({ message: 'Email sent successfully!' });
  } catch (err) {
    console.log('Email Error:', err.message);
    res.status(500).json({ message: 'Failed to send email!' });
  }
});

module.exports = router;

