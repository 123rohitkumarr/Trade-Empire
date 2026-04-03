const router = require('express').Router();
const Groq = require('groq-sdk');
const auth = require('../middleware/auth');
const Trade = require('../models/Trade');

const groq = new Groq({ apiKey: process.env.GROQ_KEY });

router.get('/insights', auth, async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user._id }).sort({ date: -1 }).limit(20);

    if (trades.length === 0) {
      return res.json({ insight: 'No trades found! Add some trades first to get AI insights.' });
    }

    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
    const wins = trades.filter(t => t.pnl > 0).length;
    const losses = trades.filter(t => t.pnl < 0).length;
    const winRate = ((wins / trades.length) * 100).toFixed(1);
    const symbols = [...new Set(trades.map(t => t.symbol))];

    const customPrompt = req.query.prompt;

    const prompt = `
      You are an expert trading coach. ${customPrompt || 'Analyze this trader performance and give 3-4 specific actionable insights in simple English.'}

      Trading Summary:
      - Total Trades: ${trades.length}
      - Wins: ${wins}, Losses: ${losses}
      - Win Rate: ${winRate}%
      - Total P&L: ₹${totalPnl.toFixed(2)}
      - Symbols Traded: ${symbols.join(', ')}
      - Recent Trades: ${JSON.stringify(trades.slice(0, 5).map(t => ({
        symbol: t.symbol,
        pnl: t.pnl,
        type: t.type
      })))}

      Give specific, practical advice based on this trader's actual data. Be encouraging but honest. Keep it short and simple.
    `;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500
    });

    res.json({ insight: response.choices[0].message.content });
  } catch (err) {
    console.log('AI Error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;