import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Trades() {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({ symbol: '', buyPrice: '', sellPrice: '', quantity: '', type: 'LONG', notes: '' });
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  const token = `Bearer ${localStorage.getItem('token')}`;

  const fetchTrades = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/trades', { headers: { Authorization: token } });
      setTrades(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => { fetchTrades(); }, []);

  const handleSubmit = async () => {
    setAdding(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/trades', {
        symbol: form.symbol,
        buyPrice: Number(form.buyPrice),
        sellPrice: Number(form.sellPrice),
        quantity: Number(form.quantity),
        type: form.type,
        notes: form.notes
      }, { headers: { Authorization: token } });
      setForm({ symbol: '', buyPrice: '', sellPrice: '', quantity: '', type: 'LONG', notes: '' });
      await fetchTrades();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding trade');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/trades/${id}`, { headers: { Authorization: token } });
      await fetchTrades();
    } catch (err) {
      console.log(err);
    }
  };

  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl < 0).length;
  const winRate = trades.length ? ((wins / trades.length) * 100).toFixed(1) : 0;

  return (
    <div className="container">
      <div className="bg-grid"></div>
      <div className="glow g1"></div>
      <div className="glow g2"></div>

      {/* HEADER */}
      <div className="header">
        <div className="logo-wrap" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">📈</span>
          <span className="logo-text">Trade<span className="logo-empire">Empire</span> 👑</span>
        </div>
        <h2 className="page-title">📒 Trade Journal</h2>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>

      <div className="content">

        {/* STATS */}
        <div className={`stats ${loaded ? 'show' : ''}`}>
          <div className="stat-card s1">
            <div className="stat-icon">💰</div>
            <p className="stat-label">Total P&L</p>
            <h2 className={`stat-value ${totalPnl >= 0 ? 'profit' : 'loss'}`}>₹{totalPnl.toFixed(2)}</h2>
            <div className="stat-bar"></div>
          </div>
          <div className="stat-card s2">
            <div className="stat-icon">📊</div>
            <p className="stat-label">Total Trades</p>
            <h2 className="stat-value">{trades.length}</h2>
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

        {/* ADD TRADE FORM */}
        <div className={`form-card ${loaded ? 'show' : ''}`}>
          <h3 className="form-title">➕ Add New Trade</h3>
          {error && <p className="error">⚠️ {error}</p>}
          <div className="form-grid">
            <input className="inp" placeholder="Symbol (e.g. RELIANCE)"
              value={form.symbol} onChange={e => setForm({...form, symbol: e.target.value.toUpperCase()})} />
            <input className="inp" placeholder="Buy Price ₹" type="number"
              value={form.buyPrice} onChange={e => setForm({...form, buyPrice: e.target.value})} />
            <input className="inp" placeholder="Sell Price ₹" type="number"
              value={form.sellPrice} onChange={e => setForm({...form, sellPrice: e.target.value})} />
            <input className="inp" placeholder="Quantity" type="number"
              value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
            <select className="inp" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="LONG">📈 LONG</option>
              <option value="SHORT">📉 SHORT</option>
            </select>
            <input className="inp" placeholder="Notes (optional)"
              value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
          <button className="add-btn" onClick={handleSubmit} disabled={adding}>
            {adding ? '⏳ Adding...' : '➕ Add Trade'}
          </button>
        </div>

        {/* TRADES TABLE */}
        <div className={`table-wrap ${loaded ? 'show' : ''}`}>
          <h3 className="form-title">📋 All Trades</h3>

          {/* Mobile Cards View */}
          <div className="mobile-trades">
            {trades.length === 0 ? (
              <div className="no-data-inner">
                <span style={{fontSize:'3rem'}}>📭</span>
                <p>No trades yet! Add your first trade above 👆</p>
              </div>
            ) : (
              trades.map((t, i) => (
                <div key={t._id} className="trade-mobile-card" style={{animationDelay: `${i * 0.05}s`}}>
                  <div className="trade-mobile-top">
                    <span className="symbol-badge">{t.symbol}</span>
                    <span className={`type-badge ${t.type === 'LONG' ? 'long' : 'short'}`}>
                      {t.type === 'LONG' ? '📈' : '📉'} {t.type}
                    </span>
                    <button className="del-btn" onClick={() => handleDelete(t._id)}>🗑️</button>
                  </div>
                  <div className="trade-mobile-body">
                    <div className="trade-mobile-row">
                      <span className="mobile-label">Buy</span>
                      <span>₹{t.buyPrice}</span>
                    </div>
                    <div className="trade-mobile-row">
                      <span className="mobile-label">Sell</span>
                      <span>₹{t.sellPrice}</span>
                    </div>
                    <div className="trade-mobile-row">
                      <span className="mobile-label">Qty</span>
                      <span>{t.quantity}</span>
                    </div>
                    <div className="trade-mobile-row">
                      <span className="mobile-label">P&L</span>
                      <span className={`pnl-val ${t.pnl >= 0 ? 'profit' : 'loss'}`}>
                        {t.pnl >= 0 ? '▲' : '▼'} ₹{Math.abs(t.pnl).toFixed(2)}
                      </span>
                    </div>
                    <div className="trade-mobile-row">
                      <span className="mobile-label">Date</span>
                      <span className="date-val">{new Date(t.date).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="table-scroll desktop-table">
            <table className="table">
              <thead>
                <tr>
                  {['Symbol', 'Type', 'Buy ₹', 'Sell ₹', 'Qty', 'P&L', 'Date', ''].map(h => (
                    <th key={h} className="th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">
                      <div className="no-data-inner">
                        <span style={{fontSize:'3rem'}}>📭</span>
                        <p>No trades yet! Add your first trade above 👆</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  trades.map((t, i) => (
                    <tr key={t._id} className="tr" style={{animationDelay: `${i * 0.05}s`}}>
                      <td className="td"><span className="symbol-badge">{t.symbol}</span></td>
                      <td className="td">
                        <span className={`type-badge ${t.type === 'LONG' ? 'long' : 'short'}`}>
                          {t.type === 'LONG' ? '📈' : '📉'} {t.type}
                        </span>
                      </td>
                      <td className="td">₹{t.buyPrice}</td>
                      <td className="td">₹{t.sellPrice}</td>
                      <td className="td">{t.quantity}</td>
                      <td className={`td pnl-val ${t.pnl >= 0 ? 'profit' : 'loss'}`}>
                        {t.pnl >= 0 ? '▲' : '▼'} ₹{Math.abs(t.pnl).toFixed(2)}
                      </td>
                      <td className="td date-val">{new Date(t.date).toLocaleDateString('en-IN')}</td>
                      <td className="td">
                        <button className="del-btn" onClick={() => handleDelete(t._id)}>🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
          position: fixed;
          width: 200%; height: 200%;
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
          position: fixed;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          z-index: 0;
          animation: floatGlow 12s infinite alternate;
        }

        .g1 { width: 400px; height: 400px; background: #6366f1; top: -100px; left: -100px; }
        .g2 { width: 300px; height: 300px; background: #22d3ee; bottom: 0; right: -100px; animation-delay: 4s; }

        @keyframes floatGlow {
          from { transform: translate(0,0); }
          to { transform: translate(40px,-40px); }
        }

        .header {
          position: sticky; top: 0; z-index: 100;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 40px;
          background: rgba(2,6,23,0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .logo-wrap { display: flex; align-items: center; gap: 8px; }
        .logo-icon { font-size: 20px; }
        .logo-text { font-size: 18px; font-weight: 800; color: white; }
        .logo-empire {
          background: linear-gradient(90deg, #6366f1, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .page-title { font-size: 16px; font-weight: 700; color: #94a3b8; }

        .back-btn {
          padding: 9px 16px;
          border-radius: 10px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          color: #818cf8;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          font-family: 'Poppins', sans-serif;
          transition: 0.3s;
          white-space: nowrap;
        }

        .back-btn:hover { background: #6366f1; color: white; }

        .content {
          position: relative; z-index: 1;
          padding: 30px 40px 80px;
          max-width: 1300px;
          margin: auto;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
          opacity: 0; transform: translateY(30px);
          transition: all 0.7s ease;
        }

        .stats.show { opacity: 1; transform: translateY(0); }

        .stat-card {
          padding: 20px;
          border-radius: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          position: relative; overflow: hidden;
          transition: 0.3s;
        }

        .stat-card:hover { transform: translateY(-4px); }
        .s1:hover { box-shadow: 0 15px 40px rgba(34,211,238,0.15); border-color: rgba(34,211,238,0.3); }
        .s2:hover { box-shadow: 0 15px 40px rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.3); }
        .s3:hover { box-shadow: 0 15px 40px rgba(236,72,153,0.15); border-color: rgba(236,72,153,0.3); }
        .s4:hover { box-shadow: 0 15px 40px rgba(129,140,248,0.15); border-color: rgba(129,140,248,0.3); }

        .stat-bar { position: absolute; bottom: 0; left: 0; height: 3px; width: 100%; }
        .s1 .stat-bar { background: linear-gradient(90deg, #22d3ee, transparent); }
        .s2 .stat-bar { background: linear-gradient(90deg, #6366f1, transparent); }
        .s3 .stat-bar { background: linear-gradient(90deg, #ec4899, transparent); }
        .s4 .stat-bar { background: linear-gradient(90deg, #818cf8, transparent); }

        .stat-icon { font-size: 22px; margin-bottom: 10px; }
        .stat-label { color: #64748b; font-size: 11px; margin-bottom: 4px; }
        .stat-value { font-size: 22px; font-weight: 800; }
        .profit { color: #22c55e; }
        .loss { color: #ef4444; }
        .divider { color: #475569; }

        .form-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 24px;
          opacity: 0; transform: translateY(30px);
          transition: all 0.7s ease 0.1s;
        }

        .form-card.show { opacity: 1; transform: translateY(0); }

        .form-title { font-size: 15px; font-weight: 700; color: #94a3b8; margin-bottom: 18px; }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .inp {
          padding: 11px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: white;
          font-size: 13px;
          font-family: 'Poppins', sans-serif;
          outline: none;
          transition: 0.3s;
          width: 100%;
        }

        .inp:focus {
          border-color: #6366f1;
          box-shadow: 0 0 15px rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.08);
        }

        .inp option { background: #0f172a; }

        .add-btn {
          padding: 12px 28px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-weight: 700;
          font-size: 14px;
          font-family: 'Poppins', sans-serif;
          cursor: pointer;
          transition: 0.3s;
          width: 100%;
        }

        .add-btn:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(99,102,241,0.4); }
        .add-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .error {
          color: #f87171; font-size: 13px; margin-bottom: 12px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
        }

        .table-wrap {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px;
          opacity: 0; transform: translateY(30px);
          transition: all 0.7s ease 0.2s;
        }

        .table-wrap.show { opacity: 1; transform: translateY(0); }
        .table-scroll { overflow-x: auto; }

        .table { width: 100%; border-collapse: collapse; min-width: 600px; }

        .th {
          padding: 12px 16px;
          text-align: left;
          color: #64748b;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          animation: fadeUp 0.4s ease forwards;
          opacity: 0;
          transition: background 0.2s;
        }

        .tr:hover { background: rgba(255,255,255,0.03); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .td { padding: 12px 16px; font-size: 13px; color: #e2e8f0; }

        .symbol-badge {
          padding: 4px 10px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 6px;
          color: #818cf8;
          font-weight: 700;
          font-size: 12px;
        }

        .type-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .long { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; }
        .short { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; }

        .pnl-val { font-weight: 700; font-size: 13px; }
        .date-val { color: #64748b; font-size: 12px; }

        .del-btn {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 14px;
          transition: 0.3s;
        }

        .del-btn:hover { background: #ef4444; }

        .no-data { padding: 0; }
        .no-data-inner {
          display: flex; flex-direction: column;
          align-items: center; gap: 12px;
          padding: 40px;
          color: #475569;
          text-align: center;
        }

        /* Mobile Cards */
        .mobile-trades { display: none; }
        .desktop-table { display: block; }

        .trade-mobile-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 12px;
          animation: fadeUp 0.4s ease forwards;
          opacity: 0;
        }

        .trade-mobile-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .trade-mobile-top .del-btn { margin-left: auto; }

        .trade-mobile-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .trade-mobile-row {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mobile-label {
          font-size: 10px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .stats { grid-template-columns: repeat(2, 1fr); }
          .form-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .header { padding: 14px 16px; }
          .page-title { display: none; }
          .content { padding: 20px 16px 60px; }
          .stats { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .stat-value { font-size: 18px; }
          .form-card { padding: 20px 16px; }
          .form-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
          .table-wrap { padding: 20px 16px; }
          .mobile-trades { display: block; }
          .desktop-table { display: none; }
        }

        @media (max-width: 480px) {
          .stats { grid-template-columns: 1fr 1fr; gap: 10px; }
          .stat-card { padding: 14px; }
          .stat-value { font-size: 16px; }
          .form-grid { grid-template-columns: 1fr; }
          .logo-text { font-size: 15px; }
        }
      `}</style>
    </div>
  );
}