const router = require('express').Router();
const { sendContactEmail } = require('../services/emailService');
const { createRateLimiter } = require('../middleware/security');

// Rate limiter for contact submissions to prevent spam attacks
const contactLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many contact messages sent. Please wait 15 minutes before sending another inquiry.'
});

const sanitize = (str) =>
  String(str || '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();

router.post('/send', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required fields!' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = String(email).trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address!' });
    }

    const safeName = sanitize(name).slice(0, 100);
    const safeSubject = sanitize(subject || 'General Inquiry').slice(0, 150);
    const safeMessage = sanitize(message).slice(0, 3000);

    if (safeMessage.length < 5) {
      return res.status(400).json({ message: 'Message must be at least 5 characters long.' });
    }

    await sendContactEmail({
      name: safeName,
      email: cleanEmail,
      subject: safeSubject,
      message: safeMessage
    });

    res.json({ message: 'Thank you! Your message has been sent successfully. We will get back to you soon.' });

  } catch (err) {
    console.error('Contact Email Error:', err.message);
    res.status(500).json({ message: 'Failed to send message. Please try again later or reach out directly via email.' });
  }
});

module.exports = router;
