import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const [trades, setTrades] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await fetch(' https://trade-empire-sgji.onrender.com/api/trades', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
        });
        const data = await res.json();
        setTrades(Array.isArray(data) ? data : []);
      } catch {
        setTrades([]);
      } finally {
        setLoaded(true);
      }
    };
    fetchTrades();
  }, []);

  const totalPnL = trades.reduce((acc, t) => acc + t.pnl, 0);
  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl < 0).length;
  const winRate = trades.length ? ((wins / trades.length) * 100).toFixed(1) : 0;

  return (
    <div className="container">

      {/* ANIMATED BACKGROUND */}
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
        <div className="header-right">
          <span className="user-badge">👤 {name}</span>
          <button className="logout" onClick={logout}>Logout →</button>
        </div>
      </div>

      <div className="content">

        {/* WELCOME */}
        <div className="welcome-wrap">
          <p className="welcome-sub">Good to see you back 🚀</p>
          <h2 className="welcome">Welcome, <span className="name-glow">{name}</span> 👑</h2>
          <p className="welcome-desc">Here's your trading empire at a glance.</p>
        </div>

        {/* STATS */}
        <div className={`stats ${loaded ? 'show' : ''}`}>
          <div className="stat-card s1">
            <div className="stat-icon">📊</div>
            <p className="stat-label">Total Trades</p>
            <h2 className="stat-value">{trades.length}</h2>
            <div className="stat-bar"></div>
          </div>

          <div className="stat-card s2">
            <div className="stat-icon">💰</div>
            <p className="stat-label">Total P&L</p>
            <h2 className={`stat-value ${totalPnL >= 0 ? 'profit' : 'loss'}`}>
              ₹{totalPnL.toFixed(2)}
            </h2>
            <div className="stat-bar"></div>
          </div>

          <div className="stat-card s3">
            <div className="stat-icon">🎯</div>
            <p className="stat-label">Win Rate</p>
            <h2 className="stat-value">{winRate}%</h2>
            <div className="stat-bar"></div>
          </div>

          <div className="stat-card s4">
            <div className="stat-icon">⚔️</div>
            <p className="stat-label">Wins / Losses</p>
            <h2 className="stat-value">
              <span className="profit">{wins}</span>
              <span className="divider"> / </span>
              <span className="loss">{losses}</span>
            </h2>
            <div className="stat-bar"></div>
          </div>
        </div>

        {/* SECTION TITLE */}
        <h3 className="section-title">⚡ Quick Actions</h3>

        {/* ACTION CARDS */}
        <div className={`actions ${loaded ? 'show' : ''}`}>
          <div className="action-card ac1" onClick={() => navigate('/trades')}>
            <div className="ac-glow"></div>
            <span className="ac-icon">📒</span>
            <h3 className="ac-title">Trade Journal</h3>
            <p className="ac-desc">Log & review all your trades</p>
            <span className="ac-arrow">→</span>
          </div>

          <div className="action-card ac2" onClick={() => navigate('/analytics')}>
            <div className="ac-glow"></div>
            <span className="ac-icon">📊</span>
            <h3 className="ac-title">Analytics</h3>
            <p className="ac-desc">Deep dive into your performance</p>
            <span className="ac-arrow">→</span>
          </div>

          <div className="action-card ac3" onClick={() => navigate('/ai-insights')}>
            <div className="ac-glow"></div>
            <span className="ac-icon">🤖</span>
            <h3 className="ac-title">AI Insights</h3>
            <p className="ac-desc">Get AI powered trade analysis</p>
            <span className="ac-arrow">→</span>
          </div>
        </div>

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

        /* GRID BG */
        .bg-grid {
          position: fixed;
          width: 200%;
          height: 200%;
          background-image:
            linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
          z-index: 0;
        }

        @keyframes gridMove {
          from { transform: translate(0,0); }
          to { transform: translate(-50px,-50px); }
        }

        /* GLOWS */
        .glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.25;
          z-index: 0;
          animation: floatGlow 12s infinite alternate;
        }

        .g1 { width: 500px; height: 500px; background: #6366f1; top: -100px; left: -100px; }
        .g2 { width: 400px; height: 400px; background: #ec4899; bottom: 0; right: -100px; animation-delay: 3s; }
        .g3 { width: 300px; height: 300px; background: #22d3ee; top: 40%; left: 40%; animation-delay: 6s; }

        @keyframes floatGlow {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(40px,-40px) scale(1.1); }
        }

        /* HEADER */
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 40px;
          background: rgba(2,6,23,0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo-icon { font-size: 24px; }

        .logo-text {
          font-size: 22px;
          font-weight: 800;
          color: white;
          letter-spacing: 0.5px;
        }

        .logo-empire {
          background: linear-gradient(90deg, #6366f1, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .user-badge {
          padding: 8px 14px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 20px;
          font-size: 13px;
          color: #a5b4fc;
        }

        .logout {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          padding: 10px 18px;
          border-radius: 10px;
          color: #f87171;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: 0.3s;
          font-family: 'Poppins', sans-serif;
        }

        .logout:hover {
          background: #ef4444;
          color: white;
          box-shadow: 0 0 20px rgba(239,68,68,0.4);
        }

        /* CONTENT */
        .content {
          position: relative;
          z-index: 1;
          padding: 50px 50px 100px;
          max-width: 1300px;
          margin: auto;
        }

        /* WELCOME */
        .welcome-wrap {
          margin-bottom: 50px;
          animation: fadeUp 0.6s ease forwards;
        }

        .welcome-sub {
          color: #64748b;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .welcome {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .name-glow {
          background: linear-gradient(90deg, #818cf8, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .welcome-desc {
          color: #475569;
          font-size: 14px;
        }

        /* STATS */
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 60px;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.7s ease;
        }

        .stats.show {
          opacity: 1;
          transform: translateY(0);
        }

        .stat-card {
          padding: 28px;
          border-radius: 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
          transition: 0.3s;
          cursor: default;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 20px 60px rgba(99,102,241,0.2);
        }

        .s1:hover { box-shadow: 0 20px 60px rgba(99,102,241,0.3); }
        .s2:hover { box-shadow: 0 20px 60px rgba(34,211,238,0.3); }
        .s3:hover { box-shadow: 0 20px 60px rgba(236,72,153,0.3); }
        .s4:hover { box-shadow: 0 20px 60px rgba(129,140,248,0.3); }

        .stat-bar {
          position: absolute;
          bottom: 0; left: 0;
          height: 3px;
          width: 100%;
        }

        .s1 .stat-bar { background: linear-gradient(90deg, #6366f1, transparent); }
        .s2 .stat-bar { background: linear-gradient(90deg, #22d3ee, transparent); }
        .s3 .stat-bar { background: linear-gradient(90deg, #ec4899, transparent); }
        .s4 .stat-bar { background: linear-gradient(90deg, #818cf8, transparent); }

        .stat-icon { font-size: 28px; margin-bottom: 14px; }
        .stat-label { color: #64748b; font-size: 13px; margin-bottom: 8px; }
        .stat-value { font-size: 28px; font-weight: 800; }

        .profit { color: #22c55e; }
        .loss { color: #ef4444; }
        .divider { color: #475569; }

        /* SECTION TITLE */
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #94a3b8;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
        }

        /* ACTION CARDS */
        .actions {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.7s ease 0.2s;
        }

        .actions.show {
          opacity: 1;
          transform: translateY(0);
        }

        .action-card {
          padding: 35px 30px;
          border-radius: 22px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          transition: 0.4s;
          position: relative;
          overflow: hidden;
        }

        .ac-glow {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0;
          transition: 0.4s;
          top: -50px;
          left: -50px;
        }

        .ac1 .ac-glow { background: #6366f1; }
        .ac2 .ac-glow { background: #22d3ee; }
        .ac3 .ac-glow { background: #ec4899; }

        .action-card:hover .ac-glow { opacity: 0.3; }

        .ac1:hover { border-color: rgba(99,102,241,0.5); box-shadow: 0 20px 60px rgba(99,102,241,0.2); transform: translateY(-8px); }
        .ac2:hover { border-color: rgba(34,211,238,0.5); box-shadow: 0 20px 60px rgba(34,211,238,0.2); transform: translateY(-8px); }
        .ac3:hover { border-color: rgba(236,72,153,0.5); box-shadow: 0 20px 60px rgba(236,72,153,0.2); transform: translateY(-8px); }

        .ac-icon { font-size: 2.5rem; display: block; margin-bottom: 16px; }

        .ac-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 8px;
          color: white;
        }

        .ac-desc {
          font-size: 13px;
          color: #64748b;
          margin-bottom: 20px;
        }

        .ac-arrow {
          font-size: 20px;
          color: #6366f1;
          font-weight: bold;
          transition: 0.3s;
        }

        .action-card:hover .ac-arrow {
          transform: translateX(6px);
          display: inline-block;
        }

        /* FOOTER */
        .footer {
          position: fixed;
          bottom: 12px;
          right: 20px;
          color: rgba(255,255,255,0.3);
          font-size: 12px;
          z-index: 10;
        }

        /* ANIMATIONS */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .content { padding: 30px 20px 100px; }
          .header { padding: 16px 20px; }
          .welcome { font-size: 24px; }
          .user-badge { display: none; }
        }
      `}</style>
    </div>
  );
}