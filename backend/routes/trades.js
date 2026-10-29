const router = require('express').Router();
const Trade = require('../models/Trade');
const auth = require('../middleware/auth');

// Helper to compute P&L correctly based on position type
const calculatePnL = (type, buyPrice, sellPrice, quantity) => {
  const isShort = String(type).toUpperCase() === 'SHORT';
  // For LONG: profit = (Exit - Entry) * Quantity
  // For SHORT: profit = (Entry - Exit) * Quantity
  const diff = isShort ? (buyPrice - sellPrice) : (sellPrice - buyPrice);
  return Number((diff * quantity).toFixed(2));
};

// Helper to compute Risk-to-Reward ratio
const calculateRiskReward = (type, buyPrice, stopLoss, target) => {
  if (stopLoss == null || target == null || isNaN(stopLoss) || isNaN(target)) {
    return null;
  }

  const isShort = String(type).toUpperCase() === 'SHORT';
  let risk = 0;
  let reward = 0;

  if (isShort) {
    risk = stopLoss - buyPrice;
    reward = buyPrice - target;
  } else {
    risk = buyPrice - stopLoss;
    reward = target - buyPrice;
  }

  if (risk > 0 && reward > 0) {
    return Number((reward / risk).toFixed(2));
  }
  return null;
};

// POST /api/trades - Create a new trade
router.post('/', auth, async (req, res) => {
  try {
    const {
      symbol,
      buyPrice,
      sellPrice,
      quantity,
      type,
      notes,
      stopLoss,
      target,
      setup,
      bias,
      preTradePsychology,
      duringTradePsychology,
      exitReason,
      mistakes,
      lessonLearned,
      date
    } = req.body;

    if (!symbol || buyPrice === undefined || sellPrice === undefined || quantity === undefined) {
      return res.status(400).json({ message: 'Symbol, entry price, exit price, and quantity are required!' });
    }

    const numBuy = Number(buyPrice);
    const numSell = Number(sellPrice);
    const numQty = Number(quantity);

    if (isNaN(numBuy) || numBuy < 0) {
      return res.status(400).json({ message: 'Entry price must be a valid non-negative number!' });
    }
    if (isNaN(numSell) || numSell < 0) {
      return res.status(400).json({ message: 'Exit price must be a valid non-negative number!' });
    }
    if (isNaN(numQty) || numQty <= 0) {
      return res.status(400).json({ message: 'Quantity must be a positive number!' });
    }

    const tradeType = (type && String(type).toUpperCase() === 'SHORT') ? 'SHORT' : 'LONG';
    const numStopLoss = stopLoss !== undefined && stopLoss !== null && stopLoss !== '' ? Number(stopLoss) : null;
    const numTarget = target !== undefined && target !== null && target !== '' ? Number(target) : null;

    const pnl = calculatePnL(tradeType, numBuy, numSell, numQty);
    const riskReward = calculateRiskReward(tradeType, numBuy, numStopLoss, numTarget);

    const trade = new Trade({
      userId: req.user._id,
      symbol: String(symbol).trim().toUpperCase(),
      buyPrice: numBuy,
      sellPrice: numSell,
      quantity: numQty,
      pnl,
      type: tradeType,
      date: date ? new Date(date) : new Date(),
      notes: notes ? String(notes).trim() : '',
      stopLoss: isNaN(numStopLoss) ? null : numStopLoss,
      target: isNaN(numTarget) ? null : numTarget,
      riskReward,
      setup: setup || 'Other',
      bias: bias || 'Bullish',
      preTradePsychology: preTradePsychology || 'Calm',
      duringTradePsychology: duringTradePsychology || 'Calm',
      exitReason: exitReason || 'Manual Exit',
      mistakes: mistakes ? String(mistakes).trim() : '',
      lessonLearned: lessonLearned ? String(lessonLearned).trim() : ''
    });

    await trade.save();
    res.status(201).json({ message: 'Trade added successfully!', trade });
  } catch (err) {
    console.error('Create Trade Error:', err.message);
    res.status(500).json({ message: err.message || 'Failed to save trade.' });
  }
});

// GET /api/trades - List all trades for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const { symbol, type, limit } = req.query;
    const query = { userId: req.user._id };

    if (symbol) {
      query.symbol = String(symbol).trim().toUpperCase();
    }
    if (type) {
      query.type = String(type).trim().toUpperCase();
    }

    const limitNum = limit ? Math.min(Number(limit) || 100, 500) : 0;

    let tradeQuery = Trade.find(query).sort({ date: -1 });
    if (limitNum > 0) {
      tradeQuery = tradeQuery.limit(limitNum);
    }

    const trades = await tradeQuery.exec();
    res.json(trades);
  } catch (err) {
    console.error('Fetch Trades Error:', err.message);
    res.status(500).json({ message: 'Failed to retrieve trades.' });
  }
});

// GET /api/trades/:id - Fetch single trade for authenticated user
router.get('/:id', auth, async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found!' });
    }
    res.json(trade);
  } catch (err) {
    console.error('Get Trade Error:', err.message);
    res.status(500).json({ message: 'Failed to retrieve trade.' });
  }
});

// PUT /api/trades/:id - Update existing trade (Strict user isolation)
router.put('/:id', auth, async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found or access denied!' });
    }

    const {
      symbol,
      buyPrice,
      sellPrice,
      quantity,
      type,
      notes,
      stopLoss,
      target,
      setup,
      bias,
      preTradePsychology,
      duringTradePsychology,
      exitReason,
      mistakes,
      lessonLearned,
      date
    } = req.body;

    if (symbol !== undefined) trade.symbol = String(symbol).trim().toUpperCase();
    if (buyPrice !== undefined) trade.buyPrice = Number(buyPrice);
    if (sellPrice !== undefined) trade.sellPrice = Number(sellPrice);
    if (quantity !== undefined) trade.quantity = Number(quantity);
    if (type !== undefined) trade.type = String(type).toUpperCase() === 'SHORT' ? 'SHORT' : 'LONG';
    if (notes !== undefined) trade.notes = String(notes).trim();
    if (date !== undefined) trade.date = new Date(date);
    if (setup !== undefined) trade.setup = setup;
    if (bias !== undefined) trade.bias = bias;
    if (preTradePsychology !== undefined) trade.preTradePsychology = preTradePsychology;
    if (duringTradePsychology !== undefined) trade.duringTradePsychology = duringTradePsychology;
    if (exitReason !== undefined) trade.exitReason = exitReason;
    if (mistakes !== undefined) trade.mistakes = String(mistakes).trim();
    if (lessonLearned !== undefined) trade.lessonLearned = String(lessonLearned).trim();

    if (stopLoss !== undefined) {
      trade.stopLoss = stopLoss !== null && stopLoss !== '' ? Number(stopLoss) : null;
    }
    if (target !== undefined) {
      trade.target = target !== null && target !== '' ? Number(target) : null;
    }

    // Recalculate P&L and Risk:Reward
    trade.pnl = calculatePnL(trade.type, trade.buyPrice, trade.sellPrice, trade.quantity);
    trade.riskReward = calculateRiskReward(trade.type, trade.buyPrice, trade.stopLoss, trade.target);

    await trade.save();
    res.json({ message: 'Trade updated successfully!', trade });
  } catch (err) {
    console.error('Update Trade Error:', err.message);
    res.status(500).json({ message: err.message || 'Failed to update trade.' });
  }
});

// DELETE /api/trades/:id - Delete trade (Strict user isolation, prevents IDOR)
router.delete('/:id', auth, async (req, res) => {
  try {
    const trade = await Trade.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found or access denied!' });
    }
    res.json({ message: 'Trade deleted successfully!' });
  } catch (err) {
    console.error('Delete Trade Error:', err.message);
    res.status(500).json({ message: 'Failed to delete trade.' });
  }
});

module.exports = router;
