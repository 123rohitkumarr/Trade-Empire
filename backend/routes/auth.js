const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  debug: true,  // ADD KARO
  logger: true  // ADD KARO
});
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUser && !existingUser.isVerified) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();
    } else {
      await User.create({ name, email, password: hashedPassword, otp, otpExpiry });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '👑 TradeEmpire — Verify Your Email',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto; background: #0f172a; padding: 40px; border-radius: 20px; color: #fff;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22d3ee; font-size: 28px; margin: 0;">📈 TradeEmpire 👑</h1>
            <p style="color: #64748b; margin-top: 8px;">India's #1 Trading Platform</p>
          </div>
          <h2 style="color: #fff; font-size: 22px; margin-bottom: 12px;">Welcome, ${name}! 🎉</h2>
          <p style="color: #94a3b8; line-height: 1.7; margin-bottom: 24px;">Thanks for joining TradeEmpire! Use the OTP below to verify your email and start your trading journey.</p>
          <div style="background: linear-gradient(135deg, #22d3ee20, #818cf820); border: 1px solid #22d3ee40; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="color: #94a3b8; font-size: 13px; margin-bottom: 8px;">Your OTP Code</p>
            <h1 style="color: #22d3ee; font-size: 48px; letter-spacing: 12px; margin: 0;">${otp}</h1>
            <p style="color: #64748b; font-size: 12px; margin-top: 12px;">⏰ Valid for 10 minutes only</p>
          </div>
          <p style="color: #475569; font-size: 13px; text-align: center;">If you didn't register on TradeEmpire, ignore this email.</p>
          <hr style="border: 1px solid #1e293b; margin: 24px 0;">
          <p style="color: #334155; font-size: 12px; text-align: center;">© 2026 TradeEmpire 👑 · Built by Rohit Dhakad, Jaipur</p>
        </div>
      `
    });

    res.json({ message: 'OTP sent to your email!', email });
  } catch (err) {
    console.log('Register Error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found!' });

    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP!' });

    if (new Date() > user.otpExpiry) return res.status(400).json({ message: 'OTP expired! Register again.' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email not found!' });

    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first!' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Wrong password!' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({ token, name: user.name });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;