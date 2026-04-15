const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const tradeRoutes = require('./routes/trades');
const aiRoutes = require('./routes/ai');
const contactRoutes = require('./routes/contact');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://trade-empire-omega.vercel.app',
    /\.vercel\.app$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log('Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/', (req, res) => {
  res.json({ message: 'Trading App Backend Running!' });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});