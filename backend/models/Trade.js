const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  symbol: {
    type: String,
    required: [true, 'Symbol is required'],
    trim: true,
    uppercase: true
  },
  buyPrice: {
    type: Number,
    required: [true, 'Entry price (buyPrice) is required'],
    min: [0, 'Entry price cannot be negative']
  },
  sellPrice: {
    type: Number,
    required: [true, 'Exit price (sellPrice) is required'],
    min: [0, 'Exit price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.000001, 'Quantity must be greater than 0']
  },
  pnl: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['LONG', 'SHORT'],
    default: 'LONG'
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  stopLoss: {
    type: Number,
    default: null
  },
  target: {
    type: Number,
    default: null
  },
  setup: {
    type: String,
    enum: ['Breakout', 'Momentum', 'Reversal', 'Support/Resistance', 'Trend Following', 'Other'],
    default: 'Other'
  },
  bias: {
    type: String,
    enum: ['Bullish', 'Bearish', 'Neutral'],
    default: 'Bullish'
  },
  preTradePsychology: {
    type: String,
    enum: ['Calm', 'Confident', 'Anxious', 'FOMO', 'Revenge Trading', 'Overconfident'],
    default: 'Calm'
  },
  duringTradePsychology: {
    type: String,
    enum: ['Calm', 'Nervous', 'Greedy', 'Fearful', 'Disciplined', 'Impulsive'],
    default: 'Calm'
  },
  riskReward: {
    type: Number,
    default: null
  },
  exitReason: {
    type: String,
    enum: ['Target Hit', 'Stop Loss Hit', 'Manual Exit', 'Trailing Stop', 'News Exit'],
    default: 'Manual Exit'
  },
  mistakes: {
    type: String,
    default: '',
    trim: true
  },
  lessonLearned: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Compound index for querying user's trades sorted by date
tradeSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('Trade', tradeSchema);
