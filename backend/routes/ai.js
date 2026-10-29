const router = require('express').Router();
const Groq = require('groq-sdk');
const auth = require('../middleware/auth');
const Trade = require('../models/Trade');
const { createRateLimiter } = require('../middleware/security');

// Rate limit AI requests to protect quotas (e.g. 20 requests per 15 minutes per IP)
const aiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'AI coach request limit reached. Please wait a few minutes before asking for new insights.'
});

const getGroqClient = () => {
  if (!process.env.GROQ_KEY) return null;
  return new Groq({ apiKey: process.env.GROQ_KEY });
};

router.get('/insights', auth, aiLimiter, async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user._id }).sort({ date: -1 }).limit(30);

    if (trades.length === 0) {
      return res.json({
        insight: 'No trades recorded yet! Log at least a few trades in your journal to receive personalized AI coaching insights.'
      });
    }

    const groq = getGroqClient();
    if (!groq) {
      // Graceful fallback when API key is not configured in local or staging environment
      const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
      const wins = trades.filter(t => (t.pnl || 0) > 0).length;
      const winRate = ((wins / trades.length) * 100).toFixed(1);

      return res.json({
        insight: `Performance Summary:\n• Total trades analyzed: ${trades.length}\n• Win rate: ${winRate}%\n• Net P&L: ₹${totalPnl.toFixed(2)}\n\n💡 Tip: Connect a valid GROQ_KEY in your server configuration to unlock real-time AI strategic suggestions and behavioral pattern analysis.`
      });
    }

    const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const wins = trades.filter(t => (t.pnl || 0) > 0).length;
    const losses = trades.filter(t => (t.pnl || 0) < 0).length;
    const winRate = ((wins / trades.length) * 100).toFixed(1);
    const symbols = [...new Set(trades.map(t => t.symbol))];

    // Sanitize user prompt to prevent abuse
    let customPrompt = 'Analyze this trader performance and provide 3-4 specific, actionable insights in clear, straightforward English.';
    if (req.query.prompt && typeof req.query.prompt === 'string') {
      const sanitized = req.query.prompt.slice(0, 300).replace(/[<>{}\\]/g, '').trim();
      if (sanitized) customPrompt = sanitized;
    }

    const prompt = `
You are an expert trading coach analyzing a student's trade journal.
Goal: ${customPrompt}

Trader Metrics (Last ${trades.length} trades):
- Total Trades: ${trades.length}
- Wins: ${wins}, Losses: ${losses}
- Win Rate: ${winRate}%
- Net P&L: ₹${totalPnl.toFixed(2)}
- Instruments Traded: ${symbols.slice(0, 8).join(', ')}
- Sample Recent Trades: ${JSON.stringify(trades.slice(0, 6).map(t => ({
      symbol: t.symbol,
      type: t.type,
      pnl: t.pnl,
      setup: t.setup,
      psychology: t.preTradePsychology
    })))}

Guidelines:
- Give concise, practical advice based strictly on these statistics.
- Highlight risk management (position size and stop loss discipline).
- Be constructive, direct, and honest. Keep total length around 150-250 words.
`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.6
    });

    const aiMessage = response.choices?.[0]?.message?.content || 'Unable to generate analysis. Please try again.';
    res.json({ insight: aiMessage });

  } catch (err) {
    console.error('Groq AI Error:', err.message);

    // Provide friendly fallback instead of leaking stack trace or failing silently
    res.status(503).json({
      message: 'AI coaching service is temporarily busy or unavailable. Please try again in a few moments.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;
