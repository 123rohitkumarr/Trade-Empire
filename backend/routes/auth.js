const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail } = require('../services/emailService');
const { createRateLimiter } = require('../middleware/security');

// Stricter rate limiter for authentication endpoints to prevent brute force
const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many authentication attempts. Please try again after 15 minutes.'
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();

    if (cleanName.length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters long!' });
    }

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address!' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long!' });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'An account with this email already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingUser && !existingUser.isVerified) {
      existingUser.name = cleanName;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      existingUser.otpAttempts = 0;
      existingUser.lastOtpSentAt = new Date();
      await existingUser.save();
    } else {
      await User.create({
        name: cleanName,
        email: cleanEmail,
        password: hashedPassword,
        otp,
        otpExpiry,
        otpAttempts: 0,
        lastOtpSentAt: new Date()
      });
    }

    res.json({ message: 'Verification OTP sent to your email!', email: cleanEmail });

    // Non-blocking email dispatch
    sendOTPEmail(cleanEmail, cleanName, otp).catch((err) => {
      console.error('Failed to send OTP email:', err.message);
    });

  } catch (err) {
    console.error('Register Error:', err.message);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', authLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required!' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanOtp = String(otp).trim();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified! Please log in.' });
    }

    // Check expiration first
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP has expired! Please request a new one.' });
    }

    // Check max attempts
    if (user.otpAttempts >= 5) {
      return res.status(429).json({ message: 'Too many incorrect attempts. Please request a new OTP.' });
    }

    // Verify OTP match
    if (user.otp !== cleanOtp) {
      user.otpAttempts = (user.otpAttempts || 0) + 1;
      await user.save();
      const remaining = 5 - user.otpAttempts;
      return res.status(400).json({
        message: remaining > 0
          ? `Invalid OTP! ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
          : 'Too many incorrect attempts. Please request a new OTP.'
      });
    }

    // Successful verification
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });

  } catch (err) {
    console.error('Verify OTP Error:', err.message);
    res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
});

// POST /api/auth/resend-otp
router.post('/resend-otp', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required!' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified! Please log in.' });
    }

    // Cooldown check (60 seconds)
    const cooldownMs = 60 * 1000;
    if (user.lastOtpSentAt && (Date.now() - new Date(user.lastOtpSentAt).getTime() < cooldownMs)) {
      const waitSeconds = Math.ceil((cooldownMs - (Date.now() - new Date(user.lastOtpSentAt).getTime())) / 1000);
      return res.status(429).json({ message: `Please wait ${waitSeconds}s before requesting another OTP.` });
    }

    const newOtp = generateOTP();
    user.otp = newOtp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    user.otpAttempts = 0;
    user.lastOtpSentAt = new Date();
    await user.save();

    res.json({ message: 'A new OTP has been sent to your email!' });

    sendOTPEmail(cleanEmail, user.name, newOtp).catch((err) => {
      console.error('Failed to resend OTP email:', err.message);
    });

  } catch (err) {
    console.error('Resend OTP Error:', err.message);
    res.status(500).json({ message: 'Failed to resend OTP. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required!' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in!',
        unverified: true,
        email: user.email
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password!' });
    }

    const secret = process.env.JWT_SECRET || 'fallback_development_secret_do_not_use_in_prod';
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

module.exports = router;
