const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  buyPrice: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  pnl: { type: Number, default: 0 },
  type: { type: String, enum: ['LONG', 'SHORT'], default: 'LONG' },
  date: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  stopLoss: { type: Number },
  target: { type: Number },
  setup: { type: String, enum: ['Breakout', 'Momentum', 'Reversal', 'Support/Resistance', 'Trend Following', 'Other'], default: 'Other' },
  bias: { type: String, enum: ['Bullish', 'Bearish', 'Neutral'], default: 'Bullish' },
  preTradePsychology: { type: String, enum: ['Calm', 'Confident', 'Anxious', 'FOMO', 'Revenge Trading', 'Overconfident'], default: 'Calm' },
  duringTradePsychology: { type: String, enum: ['Calm', 'Nervous', 'Greedy', 'Fearful', 'Disciplined', 'Impulsive'], default: 'Calm' },
  riskReward: { type: Number },
  exitReason: { type: String, enum: ['Target Hit', 'Stop Loss Hit', 'Manual Exit', 'Trailing Stop', 'News Exit'], default: 'Manual Exit' },
  mistakes: { type: String, default: '' },
  lessonLearned: { type: String, default: '' },
});

module.exports = mongoose.model('Trade', tradeSchema);