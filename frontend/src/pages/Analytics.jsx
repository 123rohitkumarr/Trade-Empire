import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

export default function Analytics() {
  const [trades, setTrades] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const token = `Bearer ${localStorage.getItem('token')}`;

  useEffect(() => {
    const getTrades = async () => {
      try {
        const res = await axios.get(' https://trade-empire-sgji.onrender.com/api/trades', {
          headers: { Authorization: token }
        });
        setTrades(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoaded(true);
      }
    };
    getTrades();
  }, []);

  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl < 0).length;
  const winRate = trades.length ? ((wins / trades.length) * 100).toFixed(1) : 0;
  const avgProfit = wins ? (trades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / wins).toFixed(2) : 0;
  const avgLoss = losses ? (trades.filter(t => t.pnl < 0).reduce((s, t) => s + t.pnl, 0) / losses).toFixed(2) : 0;

  const pnlData = [...trades].reverse().map((t, i) => ({
    name: i + 1,
    pnl: t.pnl,
    cumulative: [...trades].reverse().slice(0, i + 1).reduce((s, x) => s + x.pnl, 0)
  }));

  const symbolMap = {};
  trades.forEach(t => {
    if (!symbolMap[t.symbol]) symbolMap[t.symbol] = 0;
    symbolMap[t.symbol] += t.pnl;
  });
  const symbolData = Object.keys(symbolMap).map(k => ({ name: k, pnl: symbolMap[k] }));

  const pieData = [
    { name: 'Wins', value: wins },
    { name: 'Losses', value: losses }
  ];
  const COLORS = ['#22c55e', '#ef4444'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(15,23,42,0.95)',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: '10px',
          padding: '10px 14px',
          color: '#fff',
          fontSize: '13px'
        }}>
          <p style={{ color: '#94a3b8', marginBottom: 4 }}>Trade #{label}</p>
          <p style={{ color: payload[0].value >= 0 ? '#22c55e' : '#ef4444', fontWeight: 700 }}>
            ₹{payload[0].value?.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
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
        <h2 className="page-title">📊 Analytics</h2>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>

      <div className="content">

        {/* WELCOME */}
        <div className="welcome-wrap">
          <p className="welcome-sub">Your performance at a glance 🎯</p>
          <h2 className="welcome">Trading <span className="name-glow">Analytics</span> 📊</h2>
        </div>

        {/* STATS */}
        <div className={`stats ${loaded ? 'show' : ''}`}>
          {[
            { icon: '💰', label: 'Total P&L', value: `₹${totalPnl.toFixed(2)}`, cls: totalPnl >= 0 ? 'profit' : 'loss', bar: 's1' },
            { icon: '🎯', label: 'Win Rate', value: `${winRate}%`, cls: '', bar: 's2' },
            { icon: '📊', label: 'Total Trades', value: trades.length, cls: '', bar: 's3' },
            { icon: '📈', label: 'Avg Profit', value: `₹${avgProfit}`, cls: 'profit', bar: 's4' },
            { icon: '📉', label: 'Avg Loss', value: `₹${avgLoss}`, cls: 'loss', bar: 's5' },
            { icon: '⚔️', label: 'Wins / Losses', value: `${wins} / ${losses}`, cls: 'gold', bar: 's6' },
          ].map((s, i) => (
            <div key={s.label} className={`stat-card ${s.bar}`} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="stat-icon">{s.icon}</div>
              <p className="stat-label">{s.label}</p>
              <h2 className={`stat-value ${s.cls}`}>{s.value}</h2>
              <div className="stat-bar"></div>
            </div>
          ))}
        </div>

        {/* CUMULATIVE P&L CHART */}
        <div className={`chart-card ${loaded ? 'show' : ''}`} style={{ transitionDelay: '0.1s' }}>
          <div className="chart-header">
            <h3 className="chart-title">📈 Cumulative P&L Over Time</h3>
            <span className={`pnl-badge ${totalPnl >= 0 ? 'profit' : 'loss'}`}>
              {totalPnl >= 0 ? '▲' : '▼'} ₹{Math.abs(totalPnl).toFixed(2)}
            </span>
          </div>
          {trades.length === 0 ? (
            <div className="no-data">📭 No trades yet!</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={pnlData}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone" dataKey="cumulative"
                  stroke="#6366f1" strokeWidth={2.5}
                  dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#818cf8' }}
                  name="Cumulative P&L"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* BOTTOM CHARTS */}
        <div className="charts-row">

          {/* SYMBOL P&L */}
          <div className={`chart-card half ${loaded ? 'show' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <div className="chart-header">
              <h3 className="chart-title">🏷️ P&L by Symbol</h3>
            </div>
            {trades.length === 0 ? (
              <div className="no-data">📭 No trades yet!</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={symbolData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,23,42,0.95)',
                      border: '1px solid rgba(99,102,241,0.3)',
                      borderRadius: '10px', color: '#fff', fontSize: '13px'
                    }}
                  />
                  <Bar dataKey="pnl" name="P&L" radius={[6, 6, 0, 0]}>
                    {symbolData.map((entry, index) => (
                      <Cell key={index} fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* PIE CHART */}
          <div className={`chart-card half ${loaded ? 'show' : ''}`} style={{ transitionDelay: '0.3s' }}>
            <div className="chart-header">
              <h3 className="chart-title">🥧 Win / Loss Ratio</h3>
            </div>
            {trades.length === 0 ? (
              <div className="no-data">📭 No trades yet!</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData} cx="50%" cy="50%"
                      outerRadius={90} innerRadius={50}
                      dataKey="value" paddingAngle={4}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(15,23,42,0.95)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        borderRadius: '10px', color: '#fff', fontSize: '13px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  <span className="leg-item"><span className="leg-dot win"></span> Wins: {wins}</span>
                  <span className="leg-item"><span className="leg-dot loss-dot"></span> Losses: {losses}</span>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      <div className="footer">© 2026 TradeEmpire👑 || Built by Rohit Dhakad </div>

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
        .g3 { width: 300px; height: 300px; background: #22d3ee; top: 50%; left: 50%; animation-delay: 7s; }

        @keyframes floatGlow {
          from { transform: translate(0,0); }
          to { transform: translate(40px,-40px); }
        }

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

        .content {
          position: relative; z-index: 1;
          padding: 40px 40px 100px;
          max-width: 1300px; margin: auto;
        }

        .welcome-wrap {
          margin-bottom: 40px;
          animation: fadeUp 0.6s ease forwards;
        }

        .welcome-sub { color: #64748b; font-size: 14px; margin-bottom: 8px; }
        .welcome { font-size: 30px; font-weight: 800; }
        .name-glow {
          background: linear-gradient(90deg, #818cf8, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 18px; margin-bottom: 30px;
          opacity: 0; transform: translateY(30px);
          transition: all 0.7s ease;
        }

        .stats.show { opacity: 1; transform: translateY(0); }

        .stat-card {
          padding: 22px; border-radius: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          position: relative; overflow: hidden; transition: 0.3s;
        }

        .stat-card:hover { transform: translateY(-6px); }
        .s1:hover { box-shadow: 0 20px 50px rgba(34,211,238,0.2); border-color: rgba(34,211,238,0.3); }
        .s2:hover { box-shadow: 0 20px 50px rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.3); }
        .s3:hover { box-shadow: 0 20px 50px rgba(236,72,153,0.2); border-color: rgba(236,72,153,0.3); }
        .s4:hover { box-shadow: 0 20px 50px rgba(34,197,94,0.2); border-color: rgba(34,197,94,0.3); }
        .s5:hover { box-shadow: 0 20px 50px rgba(239,68,68,0.2); border-color: rgba(239,68,68,0.3); }
        .s6:hover { box-shadow: 0 20px 50px rgba(245,158,11,0.2); border-color: rgba(245,158,11,0.3); }

        .stat-bar { position: absolute; bottom: 0; left: 0; height: 3px; width: 100%; }
        .s1 .stat-bar { background: linear-gradient(90deg, #22d3ee, transparent); }
        .s2 .stat-bar { background: linear-gradient(90deg, #6366f1, transparent); }
        .s3 .stat-bar { background: linear-gradient(90deg, #ec4899, transparent); }
        .s4 .stat-bar { background: linear-gradient(90deg, #22c55e, transparent); }
        .s5 .stat-bar { background: linear-gradient(90deg, #ef4444, transparent); }
        .s6 .stat-bar { background: linear-gradient(90deg, #f59e0b, transparent); }

        .stat-icon { font-size: 24px; margin-bottom: 10px; }
        .stat-label { color: #64748b; font-size: 12px; margin-bottom: 6px; }
        .stat-value { font-size: 22px; font-weight: 800; color: white; }
        .profit { color: #22c55e !important; }
        .loss { color: #ef4444 !important; }
        .gold { color: #f59e0b !important; }

        .chart-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 22px; padding: 28px;
          margin-bottom: 24px;
          opacity: 0; transform: translateY(30px);
          transition: all 0.7s ease;
        }

        .chart-card.show { opacity: 1; transform: translateY(0); }

        .chart-card:hover {
          border-color: rgba(99,102,241,0.2);
          box-shadow: 0 20px 60px rgba(99,102,241,0.1);
        }

        .chart-header {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 20px;
        }

        .chart-title { font-size: 16px; font-weight: 700; color: #94a3b8; }

        .pnl-badge {
          padding: 6px 14px; border-radius: 20px;
          font-size: 13px; font-weight: 700;
        }

        .pnl-badge.profit {
          background: rgba(34,197,94,0.15);
          border: 1px solid rgba(34,197,94,0.3);
          color: #22c55e;
        }

        .pnl-badge.loss {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.3);
          color: #ef4444;
        }

        .charts-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 24px;
        }

        .half { margin-bottom: 0; }

        .pie-legend {
          display: flex; justify-content: center; gap: 24px;
          margin-top: 16px;
        }

        .leg-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: #94a3b8;
        }

        .leg-dot {
          width: 10px; height: 10px; border-radius: 50%;
        }

        .win { background: #22c55e; }
        .loss-dot { background: #ef4444; }

        .no-data {
          display: flex; justify-content: center; align-items: center;
          height: 200px; color: #475569; font-size: 15px;
        }

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
          .charts-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}