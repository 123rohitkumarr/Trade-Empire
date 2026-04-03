const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const tradeRoutes = require('./routes/trades');
const aiRoutes = require('./routes/ai');
const contactRoutes = require('./routes/contact');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.log('Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Trading App Backend Running!' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});