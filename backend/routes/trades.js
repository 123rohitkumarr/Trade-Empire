const router = require('express').Router();
const Trade = require('../models/Trade');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { symbol, buyPrice, sellPrice, quantity, type, notes } = req.body;

    const pnl = (Number(sellPrice) - Number(buyPrice)) * Number(quantity);

    const trade = new Trade({
      userId: req.user._id,
      symbol,
      buyPrice: Number(buyPrice),
      sellPrice: Number(sellPrice),
      quantity: Number(quantity),
      pnl,
      type: type || 'LONG',
      notes: notes || ''
    });

    await trade.save();
    res.json({ message: 'Trade added!', trade });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(trades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Trade.findByIdAndDelete(req.params.id);
    res.json({ message: 'Trade deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;