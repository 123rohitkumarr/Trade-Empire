import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const tips = [
  { icon: '📈', title: 'Stop Loss Analysis', desc: 'Check if your risk management is on point', prompt: 'Analyze my trades and tell me if I am using stop loss properly and how I can improve my risk management.' },
  { icon: '🎯', title: 'Trading Discipline', desc: 'Emotional trading vs strategic execution', prompt: 'Analyze my trades and tell me if I am trading emotionally or following a proper plan. Give specific advice.' },
  { icon: '📊', title: 'Position Sizing', desc: 'Are you risking too much per trade?', prompt: 'Analyze my trades and tell me if my position sizes are good or if I am risking too much per trade.' },
  { icon: '🧘', title: 'Loss Streak Analysis', desc: 'Handle losing streaks mentally & strategically', prompt: 'Analyze my trades and check if I have any loss streaks and how I should handle them mentally and strategically.' },
  { icon: '🔍', title: 'Pattern Detection', desc: 'Find your strengths and repeated mistakes', prompt: 'Analyze my trades and find any patterns — like which symbols I trade best, which time I perform well, what mistakes I repeat.' },
];

export default function AIInsights() {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTip, setActiveTip] = useState(null);
  const [loaded] = useState(true);
  const navigate = useNavigate();
  const token = `Bearer ${localStorage.getItem('token')}`;

  const getInsights = async (customPrompt = null) => {
    setLoading(true);
    setError('');
    setInsight('');
    try {
      const res = await axios.get('http://localhost:5000/api/ai/insights', {
        headers: { Authorization: token },
        params: customPrompt ? { prompt: customPrompt } : {}
      });
      setInsight(res.data.insight);
    } catch (err) {
      setError('Something went wrong! Check your API key.');
    }
    setLoading(false);
  };

  const handleTipClick = (tip, index) => {
    setActiveTip(index);
    getInsights(tip.prompt);
  };

  return (
    <div className="container">

      {/* BACKGROUND */}
      <div className="bg-grid"></div>
      <div className="glow g1"></div>
      <div className="glow g2"></div>
      <div className="glow g3"></div>

      {/* HEADER */}
      <div className="header">
        <div className="logo-wrap">
          <span className="logo-icon">📈</span>
          <span className="logo-text">Trade<span className="logo-empire">Empire</span> 👑</span>
        </div>
        <h2 className="page-title">🤖 AI Insights</h2>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>

      <div className="content">

        {/* WELCOME */}
        <div className="welcome-wrap">
          <p className="welcome-sub">Powered by Artificial Intelligence 🤖</p>
          <h2 className="welcome">Your Personal <span className="name-glow">AI Trading Coach</span> ✨</h2>
          <p className="welcome-desc">Get deep insights based on your real trading data</p>
        </div>

        {/* MAIN AI BUTTON CARD */}
        <div className={`hero-card ${loaded ? 'show' : ''}`}>
          <div className="hero-glow"></div>
          <div className="hero-inner">
            <div className="ai-avatar">🤖</div>
            <h2 className="hero-title">Full AI Trading Analysis</h2>
            <p className="hero-sub">AI will analyze ALL your trades and give you personalized recommendations, pattern detection, and strategic advice!</p>
            <button
              className={`ai-btn ${loading && activeTip === null ? 'loading' : ''}`}
              onClick={() => { setActiveTip(null); getInsights(); }}
              disabled={loading}
            >
              {loading && activeTip === null ? (
                <><span className="spinner"></span> Analyzing your trades...</>
              ) : (
                <>✨ Get Full AI Insights</>
              )}
            </button>
          </div>
        </div>

        {/* TIPS GRID */}
        <div className={`tips-section ${loaded ? 'show' : ''}`}>
          <h3 className="section-title">⚡ Quick AI Analysis</h3>
          <p className="section-sub">Click any card to get instant AI analysis on that topic</p>
          <div className="tips-grid">
            {tips.map((tip, index) => (
              <div
                key={index}
                className={`tip-card ${activeTip === index ? 'active' : ''} ${loading && activeTip === index ? 'analyzing' : ''}`}
                onClick={() => handleTipClick(tip, index)}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="tip-glow"></div>
                <div className="tip-icon">{tip.icon}</div>
                <h4 className="tip-title">{tip.title}</h4>
                <p className="tip-desc">{tip.desc}</p>
                <div className="tip-footer">
                  {loading && activeTip === index ? (
                    <span className="analyzing-text"><span className="spinner sm"></span> Analyzing...</span>
                  ) : (
                    <span className="ask-text">Ask AI →</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="error-box">
            ⚠️ {error}
          </div>
        )}

        {/* AI RESPONSE */}
        {insight && (
          <div className="insight-box show">
            <div className="insight-header">
              <div className="insight-icon">
                {activeTip !== null ? tips[activeTip].icon : '📊'}
              </div>
              <div>
                <h3 className="insight-title">
                  {activeTip !== null ? `${tips[activeTip].title} Analysis` : 'Full Trading Analysis'}
                </h3>
                <p className="insight-sub">Generated by AI based on your trade data</p>
              </div>
              <span className="insight-badge">✅ AI Response</span>
            </div>
            <div className="insight-divider"></div>
            <p className="insight-text">{insight}</p>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="loading-card">
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
            <p className="loading-text">AI is analyzing your trades...</p>
            <p className="loading-sub">This may take a few seconds ⏳</p>
          </div>
        )}

      </div>

      <div className="footer">© 2026 TradeEmpire 👑 || Built by Rohit Dhakad ✨</div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .container {
          min-height: 100vh;
          background: #020617;
          color: white;
          font-family: 'Poppins', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .bg-grid {
          position: fixed; width: 200%; height: 200%;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
          z-index: 0;
        }

        @keyframes gridMove {
          from { transform: translate(0,0); }
          to { transform: translate(-50px,-50px); }
        }

        .glow {
          position: fixed; border-radius: 50%;
          filter: blur(120px); opacity: 0.2; z-index: 0;
          animation: floatGlow 12s infinite alternate;
        }

        .g1 { width: 500px; height: 500px; background: #6366f1; top: -100px; left: -100px; }
        .g2 { width: 400px; height: 400px; background: #ec4899; bottom: 0; right: -100px; animation-delay: 4s; }
        .g3 { width: 300px; height: 300px; background: #8b5cf6; top: 40%; left: 50%; animation-delay: 7s; }

        @keyframes floatGlow {
          from { transform: translate(0,0); }
          to { transform: translate(40px,-40px); }
        }

        /* HEADER */
        .header {
          position: sticky; top: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 40px;
          background: rgba(2,6,23,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .logo-wrap { display: flex; align-items: center; gap: 8px; }
        .logo-icon { font-size: 22px; }
        .logo-text { font-size: 20px; font-weight: 800; color: white; }
        .logo-empire {
          background: linear-gradient(90deg, #6366f1, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .page-title { font-size: 18px; font-weight: 700; color: #94a3b8; }

        .back-btn {
          padding: 10px 18px; border-radius: 10px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #818cf8; cursor: pointer;
          font-weight: 600; font-size: 13px;
          font-family: 'Poppins', sans-serif; transition: 0.3s;
        }

        .back-btn:hover {
          background: #6366f1; color: white;
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
        }

        /* CONTENT */
        .content {
          position: relative; z-index: 1;
          padding: 40px 40px 100px;
          max-width: 900px; margin: auto;
        }

        /* WELCOME */
        .welcome-wrap {
          margin-bottom: 40px;
          animation: fadeUp 0.6s ease forwards;
        }

        .welcome-sub { color: #64748b; font-size: 14px; margin-bottom: 8px; }
        .welcome { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
        .welcome-desc { color: #475569; font-size: 14px; }
        .name-glow {
          background: linear-gradient(90deg, #818cf8, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* HERO CARD */
        .hero-card {
          position: relative; overflow: hidden;
          border-radius: 24px; margin-bottom: 30px;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.2);
          padding: 50px 40px;
          text-align: center;
          opacity: 0; transform: translateY(30px);
          transition: all 0.7s ease;
        }

        .hero-card.show { opacity: 1; transform: translateY(0); }

        .hero-card:hover {
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 30px 80px rgba(99,102,241,0.2);
        }

        .hero-glow {
          position: absolute; width: 300px; height: 300px;
          background: #6366f1; border-radius: 50%;
          filter: blur(100px); opacity: 0.15;
          top: -100px; left: 50%; transform: translateX(-50%);
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,100% { opacity: 0.15; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.25; transform: translateX(-50%) scale(1.2); }
        }

        .hero-inner { position: relative; z-index: 1; }

        .ai-avatar {
          font-size: 64px; margin-bottom: 20px;
          animation: bob 3s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes bob {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .hero-title { font-size: 26px; font-weight: 800; margin-bottom: 12px; }

        .hero-sub {
          color: #64748b; font-size: 14px; line-height: 1.7;
          margin-bottom: 30px; max-width: 500px; margin-left: auto; margin-right: auto;
        }

        .ai-btn {
          padding: 14px 36px; border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          background-size: 200% 200%;
          animation: gradShift 4s ease infinite;
          color: white; font-weight: 700;
          font-size: 16px; font-family: 'Poppins', sans-serif;
          cursor: pointer; transition: 0.3s;
          display: inline-flex; align-items: center; gap: 10px;
        }

        @keyframes gradShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .ai-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 40px rgba(99,102,241,0.6);
        }

        .ai-btn:disabled {
          opacity: 0.7; cursor: not-allowed; transform: none;
        }

        /* SPINNER */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }

        .spinner.sm { width: 12px; height: 12px; }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* TIPS */
        .tips-section {
          margin-bottom: 30px;
          opacity: 0; transform: translateY(30px);
          transition: all 0.7s ease 0.15s;
        }

        .tips-section.show { opacity: 1; transform: translateY(0); }

        .section-title { font-size: 18px; font-weight: 700; color: #94a3b8; margin-bottom: 6px; }
        .section-sub { color: #475569; font-size: 13px; margin-bottom: 20px; }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .tip-card {
          position: relative; overflow: hidden;
          padding: 24px; border-radius: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer; transition: 0.3s;
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
        }

        .tip-card.show { opacity: 1; }

        .tip-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 20px 50px rgba(99,102,241,0.2);
        }

        .tip-card.active {
          border-color: rgba(99,102,241,0.6) !important;
          background: rgba(99,102,241,0.1) !important;
          box-shadow: 0 20px 50px rgba(99,102,241,0.3);
        }

        .tip-glow {
          position: absolute; width: 150px; height: 150px;
          background: #6366f1; border-radius: 50%;
          filter: blur(60px); opacity: 0;
          top: -50px; left: -50px; transition: 0.4s;
        }

        .tip-card:hover .tip-glow { opacity: 0.2; }
        .tip-card.active .tip-glow { opacity: 0.3; }

        .tip-icon { font-size: 32px; margin-bottom: 14px; display: block; }
        .tip-title { font-size: 15px; font-weight: 700; margin-bottom: 6px; color: white; }
        .tip-desc { font-size: 12px; color: #64748b; margin-bottom: 16px; line-height: 1.5; }

        .tip-footer { display: flex; align-items: center; }

        .ask-text {
          font-size: 13px; color: #6366f1; font-weight: 600;
          transition: 0.3s;
        }

        .tip-card:hover .ask-text { transform: translateX(4px); display: inline-block; }

        .analyzing-text {
          font-size: 12px; color: #818cf8;
          display: flex; align-items: center; gap: 6px;
        }

        /* ERROR */
        .error-box {
          padding: 14px 20px; border-radius: 12px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171; font-size: 14px;
          margin-bottom: 20px;
          animation: fadeUp 0.4s ease forwards;
        }

        /* INSIGHT BOX */
        .insight-box {
          background: rgba(99,102,241,0.06);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 22px; padding: 30px;
          margin-bottom: 30px;
          animation: fadeUp 0.6s ease forwards;
        }

        .insight-header {
          display: flex; align-items: flex-start; gap: 16px;
          margin-bottom: 20px;
        }

        .insight-icon {
          font-size: 36px; flex-shrink: 0;
          animation: bob 3s ease-in-out infinite;
        }

        .insight-title { font-size: 18px; font-weight: 700; color: white; margin-bottom: 4px; }
        .insight-sub { font-size: 12px; color: #64748b; }

        .insight-badge {
          margin-left: auto; flex-shrink: 0;
          padding: 6px 14px; border-radius: 20px;
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.3);
          color: #22c55e; font-size: 12px; font-weight: 600;
        }

        .insight-divider {
          height: 1px;
          background: rgba(99,102,241,0.2);
          margin-bottom: 20px;
        }

        .insight-text {
          color: #e2e8f0; font-size: 14px;
          line-height: 1.9; white-space: pre-line;
        }

        /* LOADING CARD */
        .loading-card {
          text-align: center; padding: 50px;
          animation: fadeUp 0.4s ease forwards;
        }

        .loading-dots {
          display: flex; justify-content: center; gap: 8px;
          margin-bottom: 20px;
        }

        .loading-dots span {
          width: 12px; height: 12px;
          background: #6366f1; border-radius: 50%;
          animation: dotBounce 1.2s ease-in-out infinite;
        }

        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dotBounce {
          0%,100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-12px); opacity: 1; }
        }

        .loading-text { font-size: 16px; font-weight: 600; color: #94a3b8; margin-bottom: 8px; }
        .loading-sub { font-size: 13px; color: #475569; }

        .footer {
          position: fixed; bottom: 12px; right: 20px;
          color: rgba(255,255,255,0.3); font-size: 12px; z-index: 10;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .content { padding: 20px 16px 100px; }
          .header { padding: 14px 16px; }
          .page-title { display: none; }
          .hero-card { padding: 30px 20px; }
          .tips-grid { grid-template-columns: 1fr; }
          .insight-badge { display: none; }
        }
      `}</style>
    </div>
  );
}