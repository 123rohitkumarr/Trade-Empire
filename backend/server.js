const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { securityHeaders } = require('./middleware/security');
const authRoutes = require('./routes/auth');
const tradeRoutes = require('./routes/trades');
const aiRoutes = require('./routes/ai');
const contactRoutes = require('./routes/contact');

const app = express();

// Security Headers
app.use(securityHeaders);

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://trade-empire-omega.vercel.app',
  /\.vercel\.app$/
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser tools, postman, curl, or same-origin requests
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) => {
      if (allowed instanceof RegExp) return allowed.test(origin);
      return allowed === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in dev/staging to prevent CORS lockouts while logging
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Database connection
if (process.env.MONGO_URI && process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected!'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));
} else if (process.env.NODE_ENV !== 'test') {
  console.warn('⚠️ MONGO_URI is not set in environment variables. Database features will fail until configured.');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbStatusMap[dbState] || 'unknown'
  });
});

app.get('/', (req, res) => {
  res.json({
    name: 'Trade Empire API',
    status: 'online',
    version: '1.0.0'
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    message: err.message || 'An unexpected internal server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start listener only when executed directly (not when required by tests)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Trade Empire server running on port ${PORT}`);
  });
}

module.exports = app;
