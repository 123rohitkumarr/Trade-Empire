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
  notes: { type: String, default: '' }
});

module.exports = mongoose.model('Trade', tradeSchema);