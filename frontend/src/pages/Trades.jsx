import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SETUPS = ['Breakout', 'Momentum', 'Reversal', 'Support/Resistance', 'Trend Following', 'Other'];
const BIASES = ['Bullish', 'Bearish', 'Neutral'];
const PRE_PSYCH = ['Calm', 'Confident', 'Anxious', 'FOMO', 'Revenge Trading', 'Overconfident'];
const DURING_PSYCH = ['Calm', 'Nervous', 'Greedy', 'Fearful', 'Disciplined', 'Impulsive'];
const EXIT_REASONS = ['Target Hit', 'Stop Loss Hit', 'Manual Exit', 'Trailing Stop', 'News Exit'];

const PSYCH_EMOJI = { Calm: '😌', Confident: '💪', Anxious: '😰', FOMO: '😱', 'Revenge Trading': '😤', Overconfident: '🤩', Nervous: '😬', Greedy: '🤑', Fearful: '😨', Disciplined: '🧘', Impulsive: '⚡' };
const BIAS_EMOJI = { Bullish: '📈', Bearish: '📉', Neutral: '➡️' };
const SETUP_EMOJI = { Breakout: '🚀', Momentum: '⚡', Reversal: '🔄', 'Support/Resistance': '🧱', 'Trend Following': '📊', Other: '📝' };

export default function Trades() {
  const [trades, setTrades] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('journal');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [form, setForm] = useState({
    symbol: '', buyPrice: '', sellPrice: '', quantity: '', type: 'LONG',
    stopLoss: '', target: '', setup: 'Breakout', bias: 'Bullish',
    preTradePsychology: 'Calm', duringTradePsychology: 'Calm',
    exitReason: 'Manual Exit', notes: '', mistakes: '', lessonLearned: ''
  });
  const navigate = useNavigate();
  const token = `Bearer ${localStorage.getItem('token')}`;

  const fetchTrades = async () => {
    try {
      const res = await axios.get(' https://trade-empire-sgji.onrender.com/api/trades', { headers: { Authorization: token } });
      setTrades(res.data);
    } catch (err) { console.log(err); }
    finally { setLoaded(true); }
  };

  useEffect(() => { fetchTrades(); }, []);

  // ✅ FIX: TradingView widget loaded only once, only when simulator tab is active
  useEffect(() => {
    if (activeTab !== 'simulator') return;

    const existingScript = document.getElementById('tv-script');
    const initWidget = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: 'tv-widget',
          symbol: 'NSE:NIFTY',
          interval: 'D',
          timezone: 'Asia/Kolkata',
          theme: 'dark',
          style: '1',
          locale: 'in',
          toolbar_bg: '#0f172a',
          enable_publishing: false,
          hide_top_toolbar: false,
          allow_symbol_change: true,
          save_image: true,
          height: 600,
          width: '100%',
          studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
        });
      }
    };

    if (existingScript) {
      initWidget();
    } else {
      const script = document.createElement('script');
      script.id = 'tv-script';
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    }
  }, [activeTab]);

  const loadSymbol = (sym) => {
    const el = document.getElementById('tv-widget');
    if (el) el.innerHTML = '';
    if (window.TradingView) {
      new window.TradingView.widget({
        container_id: 'tv-widget',
        symbol: sym,
        interval: 'D',
        timezone: 'Asia/Kolkata',
        theme: 'dark',
        style: '1',
        locale: 'in',
        toolbar_bg: '#0f172a',
        enable_publishing: false,
        hide_top_toolbar: false,
        allow_symbol_change: true,
        save_image: true,
        height: 600,
        width: '100%',
        studies: ['RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.symbol) { setError('Symbol is required!'); return; }
    setAdding(true); setError('');
    try {
      await axios.post(' https://trade-empire-sgji.onrender.com/api/trades', {
        ...form,
        buyPrice: Number(form.buyPrice),
        sellPrice: Number(form.sellPrice),
        quantity: Number(form.quantity),
        stopLoss: form.stopLoss ? Number(form.stopLoss) : null,
        target: form.target ? Number(form.target) : null,
      }, { headers: { Authorization: token } });
      setForm({ symbol: '', buyPrice: '', sellPrice: '', quantity: '', type: 'LONG', stopLoss: '', target: '', setup: 'Breakout', bias: 'Bullish', preTradePsychology: 'Calm', duringTradePsychology: 'Calm', exitReason: 'Manual Exit', notes: '', mistakes: '', lessonLearned: '' });
      await fetchTrades();
    } catch (err) { setError(err.response?.data?.message || 'Error adding trade'); }
    finally { setAdding(false); }
  };

  const handleDelete = async (id) => {
    await axios.delete(` https://trade-empire-sgji.onrender.com/api/trades/${id}`, { headers: { Authorization: token } });
    await fetchTrades();
    setSelectedTrade(null);
  };

  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0);
  const wins = trades.filter(t => t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl < 0).length;
  const winRate = trades.length ? ((wins / trades.length) * 100).toFixed(1) : 0;
  const avgRR = trades.filter(t => t.riskReward).length
    ? (trades.filter(t => t.riskReward).reduce((s, t) => s + t.riskReward, 0) / trades.filter(t => t.riskReward).length).toFixed(2)
    : 'N/A';

  // Calendar logic
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth, year, month };
  };

  const getTradesForDay = (day) => {
    const { year, month } = getDaysInMonth(calendarMonth);
    return trades.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const getDayPnl = (day) => getTradesForDay(day).reduce((s, t) => s + t.pnl, 0);
  const { firstDay, daysInMonth } = getDaysInMonth(calendarMonth);

  return (
    <div className="container">
      <div className="bg-grid"></div>
      <div className="glow g1"></div>
      <div className="glow g2"></div>

      {/* HEADER */}
      <div className="header">
        <div className="logo-wrap" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <span>📈</span>
          <span className="logo-text">Trade<span className="logo-emp">Empire</span> 👑</span>
        </div>
        <div className="tabs">
          {[['journal', '📒 Journal'], ['calendar', '📅 Calendar'], ['simulator', '📊 Simulator']].map(([id, label]) => (
            <button key={id} className={`tab ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>{label}</button>
          ))}
        </div>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>

      {/* STATS */}
      <div className={`stats ${loaded ? 'show' : ''}`}>
        {[
          { icon: '💰', label: 'Total P&L', value: `₹${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? '#22c55e' : '#ef4444' },
          { icon: '📊', label: 'Total Trades', value: trades.length, color: '#fff' },
          { icon: '🎯', label: 'Win Rate', value: `${winRate}%`, color: '#818cf8' },
          { icon: '⚔️', label: 'W / L', value: `${wins} / ${losses}`, color: '#fff' },
          { icon: '📐', label: 'Avg R:R', value: avgRR, color: '#22d3ee' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <span className="stat-icon">{s.icon}</span>
            <p className="stat-label">{s.label}</p>
            <h2 className="stat-value" style={{ color: s.color }}>{s.value}</h2>
          </div>
        ))}
      </div>

      <div className="content">

        {/* ═══════════ JOURNAL TAB ═══════════ */}
        {activeTab === 'journal' && (
          <div style={{ opacity: 1 }}>

            {/* ADD TRADE FORM */}
            <div className="card">
              <h3 className="card-title">➕ Add New Trade</h3>
              {error && <p className="error">⚠️ {error}</p>}

              {/* Basic Info */}
              <p className="section-label">📋 Basic Info</p>
              <div className="form-grid-3">
                <div className="field">
                  <label>Symbol</label>
                  <input className="inp" placeholder="RELIANCE" value={form.symbol} onChange={e => setForm({ ...form, symbol: e.target.value.toUpperCase() })} />
                </div>
                <div className="field">
                  <label>Type</label>
                  <select className="inp" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="LONG">📈 LONG</option>
                    <option value="SHORT">📉 SHORT</option>
                  </select>
                </div>
                <div className="field">
                  <label>Quantity</label>
                  <input className="inp" type="number" placeholder="10" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                </div>
              </div>

              {/* Entry / Exit / Stop */}
              <p className="section-label">🎯 Entry · Exit · Stop Loss Framework</p>
              <div className="form-grid-4">
                <div className="field">
                  <label>Entry Price ₹</label>
                  <input className="inp inp-entry" type="number" placeholder="2400" value={form.buyPrice} onChange={e => setForm({ ...form, buyPrice: e.target.value })} />
                </div>
                <div className="field">
                  <label>Exit Price ₹</label>
                  <input className="inp inp-exit" type="number" placeholder="2500" value={form.sellPrice} onChange={e => setForm({ ...form, sellPrice: e.target.value })} />
                </div>
                <div className="field">
                  <label>Stop Loss ₹</label>
                  <input className="inp inp-stop" type="number" placeholder="2350" value={form.stopLoss} onChange={e => setForm({ ...form, stopLoss: e.target.value })} />
                </div>
                <div className="field">
                  <label>Target ₹</label>
                  <input className="inp inp-target" type="number" placeholder="2600" value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} />
                </div>
              </div>

              {/* Live RR Preview */}
              {form.buyPrice && form.stopLoss && form.target && (
                <div className="rr-preview">
                  <span>📐 Risk:Reward = <strong style={{ color: '#22d3ee' }}>1 : {Math.abs((form.target - form.buyPrice) / (form.buyPrice - form.stopLoss)).toFixed(2)}</strong></span>
                  <span>💰 Max Risk = <strong style={{ color: '#ef4444' }}>₹{Math.abs((form.buyPrice - form.stopLoss) * (form.quantity || 1)).toFixed(2)}</strong></span>
                  <span>🎯 Max Profit = <strong style={{ color: '#22c55e' }}>₹{Math.abs((form.target - form.buyPrice) * (form.quantity || 1)).toFixed(2)}</strong></span>
                </div>
              )}

              {/* Setup & Bias */}
              <p className="section-label">🧠 Setup & Bias</p>
              <div className="form-grid-2">
                <div className="field">
                  <label>Setup</label>
                  <div className="chip-group">
                    {SETUPS.map(s => (
                      <button key={s} className={`chip ${form.setup === s ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, setup: s })}>
                        {SETUP_EMOJI[s]} {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>Market Bias</label>
                  <div className="chip-group">
                    {BIASES.map(b => (
                      <button key={b} className={`chip ${form.bias === b ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, bias: b })}>
                        {BIAS_EMOJI[b]} {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Psychology */}
              <p className="section-label">🧘 Psychology</p>
              <div className="form-grid-2">
                <div className="field">
                  <label>Before Trade</label>
                  <div className="chip-group">
                    {PRE_PSYCH.map(p => (
                      <button key={p} className={`chip ${form.preTradePsychology === p ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, preTradePsychology: p })}>
                        {PSYCH_EMOJI[p]} {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>During Trade</label>
                  <div className="chip-group">
                    {DURING_PSYCH.map(p => (
                      <button key={p} className={`chip ${form.duringTradePsychology === p ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, duringTradePsychology: p })}>
                        {PSYCH_EMOJI[p]} {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Exit Reason */}
              <p className="section-label">🚪 Exit Reason</p>
              <div className="chip-group">
                {EXIT_REASONS.map(r => (
                  <button key={r} className={`chip ${form.exitReason === r ? 'chip-active' : ''}`} onClick={() => setForm({ ...form, exitReason: r })}>{r}</button>
                ))}
              </div>

              {/* Notes */}
              <p className="section-label">📝 Notes & Review</p>
              <div className="form-grid-3">
                <div className="field">
                  <label>Trade Notes</label>
                  <textarea className="inp" rows={3} placeholder="What happened in this trade..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
                <div className="field">
                  <label>Mistakes Made</label>
                  <textarea className="inp" rows={3} placeholder="What went wrong..." value={form.mistakes} onChange={e => setForm({ ...form, mistakes: e.target.value })} />
                </div>
                <div className="field">
                  <label>Lesson Learned</label>
                  <textarea className="inp" rows={3} placeholder="What I learned..." value={form.lessonLearned} onChange={e => setForm({ ...form, lessonLearned: e.target.value })} />
                </div>
              </div>

              <button className="add-btn" onClick={handleSubmit} disabled={adding}>
                {adding ? '⏳ Adding...' : '➕ Add Trade'}
              </button>
            </div>

            {/* TRADES LIST */}
            <div className="card">
              <h3 className="card-title">📋 All Trades</h3>

              {/* Mobile Cards */}
              <div className="mobile-trades">
                {trades.length === 0 ? (
                  <div className="no-data"><span style={{ fontSize: 48 }}>📭</span><p>No trades yet!</p></div>
                ) : trades.map((t) => (
                  <div key={t._id} className="trade-card" onClick={() => setSelectedTrade(selectedTrade?._id === t._id ? null : t)}>
                    <div className="trade-card-top">
                      <span className="symbol-badge">{t.symbol}</span>
                      <span className={`type-badge ${t.type === 'LONG' ? 'long' : 'short'}`}>{t.type === 'LONG' ? '📈' : '📉'} {t.type}</span>
                      <span className="setup-badge">{SETUP_EMOJI[t.setup]} {t.setup}</span>
                      <span className={`pnl-val ${t.pnl >= 0 ? 'profit' : 'loss'}`}>{t.pnl >= 0 ? '▲' : '▼'} ₹{Math.abs(t.pnl).toFixed(2)}</span>
                      <button className="del-btn" onClick={e => { e.stopPropagation(); handleDelete(t._id); }}>🗑️</button>
                    </div>
                    {selectedTrade?._id === t._id && (
                      <div className="trade-detail">
                        <div className="detail-grid">
                          <div className="detail-item"><span className="dl">Entry</span><span className="dv">₹{t.buyPrice}</span></div>
                          <div className="detail-item"><span className="dl">Exit</span><span className="dv">₹{t.sellPrice}</span></div>
                          <div className="detail-item"><span className="dl">Stop Loss</span><span className="dv" style={{ color: '#ef4444' }}>{t.stopLoss ? `₹${t.stopLoss}` : 'N/A'}</span></div>
                          <div className="detail-item"><span className="dl">Target</span><span className="dv" style={{ color: '#22c55e' }}>{t.target ? `₹${t.target}` : 'N/A'}</span></div>
                          <div className="detail-item"><span className="dl">R:R</span><span className="dv" style={{ color: '#22d3ee' }}>{t.riskReward ? `1:${t.riskReward.toFixed(2)}` : 'N/A'}</span></div>
                          <div className="detail-item"><span className="dl">Qty</span><span className="dv">{t.quantity}</span></div>
                          <div className="detail-item"><span className="dl">Bias</span><span className="dv">{BIAS_EMOJI[t.bias]} {t.bias}</span></div>
                          <div className="detail-item"><span className="dl">Exit</span><span className="dv">{t.exitReason}</span></div>
                        </div>
                        <div className="psych-row">
                          <span className="psych-badge">Before: {PSYCH_EMOJI[t.preTradePsychology]} {t.preTradePsychology}</span>
                          <span className="psych-badge">During: {PSYCH_EMOJI[t.duringTradePsychology]} {t.duringTradePsychology}</span>
                        </div>
                        {t.notes && <div className="note-box"><span className="nl">📝 Notes:</span> {t.notes}</div>}
                        {t.mistakes && <div className="note-box" style={{ borderColor: '#ef444440' }}><span className="nl" style={{ color: '#ef4444' }}>❌ Mistakes:</span> {t.mistakes}</div>}
                        {t.lessonLearned && <div className="note-box" style={{ borderColor: '#22d3ee40' }}><span className="nl" style={{ color: '#22d3ee' }}>💡 Lesson:</span> {t.lessonLearned}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="desktop-table">
                <div className="table-scroll">
                  <table className="table">
                    <thead>
                      <tr>
                        {['Symbol', 'Type', 'Setup', 'Entry', 'Exit', 'SL', 'Target', 'R:R', 'P&L', 'Bias', 'Pre Psych', 'Exit Reason', 'Date', ''].map(h => (
                          <th key={h} className="th">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {trades.length === 0 ? (
                        <tr><td colSpan="14" className="no-data"><div style={{ padding: 40, textAlign: 'center', color: '#475569' }}>📭 No trades yet!</div></td></tr>
                      ) : trades.map((t) => (
                        <tr key={t._id} className="tr" onClick={() => setSelectedTrade(selectedTrade?._id === t._id ? null : t)} style={{ cursor: 'pointer' }}>
                          <td className="td"><span className="symbol-badge">{t.symbol}</span></td>
                          <td className="td"><span className={`type-badge ${t.type === 'LONG' ? 'long' : 'short'}`}>{t.type === 'LONG' ? '📈' : '📉'} {t.type}</span></td>
                          <td className="td"><span className="setup-chip">{SETUP_EMOJI[t.setup]} {t.setup}</span></td>
                          <td className="td">₹{t.buyPrice}</td>
                          <td className="td">₹{t.sellPrice}</td>
                          <td className="td" style={{ color: '#ef4444' }}>{t.stopLoss ? `₹${t.stopLoss}` : '—'}</td>
                          <td className="td" style={{ color: '#22c55e' }}>{t.target ? `₹${t.target}` : '—'}</td>
                          <td className="td" style={{ color: '#22d3ee' }}>{t.riskReward ? `1:${t.riskReward.toFixed(2)}` : '—'}</td>
                          <td className={`td pnl-val ${t.pnl >= 0 ? 'profit' : 'loss'}`}>{t.pnl >= 0 ? '▲' : '▼'} ₹{Math.abs(t.pnl).toFixed(2)}</td>
                          <td className="td">{BIAS_EMOJI[t.bias]} {t.bias}</td>
                          <td className="td">{PSYCH_EMOJI[t.preTradePsychology]} {t.preTradePsychology}</td>
                          <td className="td">{t.exitReason}</td>
                          <td className="td date-val">{new Date(t.date).toLocaleDateString('en-IN')}</td>
                          <td className="td"><button className="del-btn" onClick={e => { e.stopPropagation(); handleDelete(t._id); }}>🗑️</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Selected Trade Detail */}
                {selectedTrade && (
                  <div className="trade-detail-desktop">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h3 style={{ color: '#fff', fontSize: 16 }}>📋 {selectedTrade.symbol} — Trade Details</h3>
                      <button onClick={() => setSelectedTrade(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18 }}>✕</button>
                    </div>
                    <div className="detail-grid-desktop">
                      {[
                        ['Entry', `₹${selectedTrade.buyPrice}`, ''],
                        ['Exit', `₹${selectedTrade.sellPrice}`, ''],
                        ['Stop Loss', selectedTrade.stopLoss ? `₹${selectedTrade.stopLoss}` : 'N/A', '#ef4444'],
                        ['Target', selectedTrade.target ? `₹${selectedTrade.target}` : 'N/A', '#22c55e'],
                        ['R:R Ratio', selectedTrade.riskReward ? `1:${selectedTrade.riskReward.toFixed(2)}` : 'N/A', '#22d3ee'],
                        ['Setup', `${SETUP_EMOJI[selectedTrade.setup]} ${selectedTrade.setup}`, ''],
                        ['Bias', `${BIAS_EMOJI[selectedTrade.bias]} ${selectedTrade.bias}`, ''],
                        ['Exit Reason', selectedTrade.exitReason, ''],
                        ['Pre Psych', `${PSYCH_EMOJI[selectedTrade.preTradePsychology]} ${selectedTrade.preTradePsychology}`, ''],
                        ['During Psych', `${PSYCH_EMOJI[selectedTrade.duringTradePsychology]} ${selectedTrade.duringTradePsychology}`, ''],
                      ].map(([label, value, color]) => (
                        <div key={label} className="detail-item">
                          <span className="dl">{label}</span>
                          <span className="dv" style={{ color: color || '#e2e8f0' }}>{value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="psych-row" style={{ marginTop: 12 }}>
                      {selectedTrade.notes && <div className="note-box">📝 <strong>Notes:</strong> {selectedTrade.notes}</div>}
                      {selectedTrade.mistakes && <div className="note-box" style={{ borderColor: '#ef444440' }}>❌ <strong style={{ color: '#ef4444' }}>Mistakes:</strong> {selectedTrade.mistakes}</div>}
                      {selectedTrade.lessonLearned && <div className="note-box" style={{ borderColor: '#22d3ee40' }}>💡 <strong style={{ color: '#22d3ee' }}>Lesson:</strong> {selectedTrade.lessonLearned}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ CALENDAR TAB ═══════════ */}
        {activeTab === 'calendar' && (
          <div className={`card ${loaded ? 'show' : ''}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 className="card-title" style={{ margin: 0 }}>📅 Trading Calendar</h3>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button className="cal-nav" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}>←</button>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                  {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button className="cal-nav" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}>→</button>
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(34,197,94,0.3)', display: 'inline-block' }}></span>Profit Day</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(239,68,68,0.3)', display: 'inline-block' }}></span>Loss Day</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(99,102,241,0.2)', display: 'inline-block' }}></span>No Trade Day</span>
            </div>

            {/* Day Labels */}
            <div className="cal-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="cal-day-label">{d}</div>
              ))}

              {/* Empty cells */}
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} className="cal-cell empty" />)}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayTrades = getTradesForDay(day);
                const dayPnl = getDayPnl(day);
                const isToday = new Date().getDate() === day &&
                  new Date().getMonth() === calendarMonth.getMonth() &&
                  new Date().getFullYear() === calendarMonth.getFullYear();

                return (
                  <div key={day} className={`cal-cell ${dayTrades.length > 0 ? (dayPnl >= 0 ? 'profit-day' : 'loss-day') : ''} ${isToday ? 'today' : ''}`}>
                    <span className="cal-date">{day}</span>
                    {dayTrades.length > 0 && (
                      <>
                        <span className={`cal-pnl ${dayPnl >= 0 ? 'profit' : 'loss'}`}>
                          {dayPnl >= 0 ? '+' : ''}₹{Math.abs(dayPnl).toFixed(0)}
                        </span>
                        <span className="cal-count">{dayTrades.length} trade{dayTrades.length > 1 ? 's' : ''}</span>
                      </>
                    )}
                    {dayTrades.length === 0 && day <= new Date().getDate() && calendarMonth.getMonth() === new Date().getMonth() && (
                      <span className="cal-notrade">No Trade</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Monthly Summary */}
            <div className="monthly-summary">
              <div className="ms-item">
                <span className="ms-label">Trading Days</span>
                <span className="ms-value">{new Set(trades.filter(t => {
                  const d = new Date(t.date);
                  return d.getMonth() === calendarMonth.getMonth() && d.getFullYear() === calendarMonth.getFullYear();
                }).map(t => new Date(t.date).getDate())).size}</span>
              </div>
              <div className="ms-item">
                <span className="ms-label">Profit Days</span>
                <span className="ms-value profit">{Array.from({ length: daysInMonth }, (_, i) => i + 1).filter(d => getDayPnl(d) > 0 && getTradesForDay(d).length > 0).length}</span>
              </div>
              <div className="ms-item">
                <span className="ms-label">Loss Days</span>
                <span className="ms-value loss">{Array.from({ length: daysInMonth }, (_, i) => i + 1).filter(d => getDayPnl(d) < 0 && getTradesForDay(d).length > 0).length}</span>
              </div>
              <div className="ms-item">
                <span className="ms-label">Monthly P&L</span>
                <span className={`ms-value ${Array.from({ length: daysInMonth }, (_, i) => i + 1).reduce((s, d) => s + getDayPnl(d), 0) >= 0 ? 'profit' : 'loss'}`}>
                  ₹{Array.from({ length: daysInMonth }, (_, i) => i + 1).reduce((s, d) => s + getDayPnl(d), 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ SIMULATOR TAB ═══════════ */}
        {activeTab === 'simulator' && (
          <div style={{ opacity: 1 }}>

            {/* Symbol Switcher Bar */}
            <div className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <h3 className="card-title" style={{ margin: 0 }}>📊 Chart Simulator</h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { sym: 'NSE:NIFTY', label: 'NIFTY' },
                    { sym: 'NSE:BANKNIFTY', label: 'BANKNIFTY' },
                    { sym: 'NSE:RELIANCE', label: 'RELIANCE' },
                    { sym: 'NSE:TCS', label: 'TCS' },
                    { sym: 'NSE:INFY', label: 'INFY' },
                    { sym: 'NSE:HDFC', label: 'HDFC' },
                    { sym: 'NSE:SBIN', label: 'SBIN' },
                    { sym: 'NSE:WIPRO', label: 'WIPRO' },
                  ].map(({ sym, label }) => (
                    <button key={sym} className="sim-btn" onClick={() => loadSymbol(sym)}>{label}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* ✅ FIX: Single TradingView chart container — no duplicate */}
            <div style={{ background: '#0f172a', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
              <div id="tv-widget" style={{ height: 600, width: '100%' }}></div>
            </div>

            {/* Checklist + Rules */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* Pre-Trade Checklist */}
              <div className="card" style={{ opacity: 1, transform: 'none' }}>
                <h4 style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>📋 Pre-Trade Checklist</h4>
                {[
                  'Trend identified?',
                  'Setup confirmed?',
                  'Support/Resistance marked?',
                  'Entry point defined?',
                  'Stop Loss set?',
                  'Target set?',
                  'Risk calculated (1-2%)?',
                  'News/Events checked?',
                  'Emotionally calm?',
                  'Position size decided?',
                ].map((item, i) => (
                  <label key={i} className="checklist-item">
                    <input type="checkbox" className="check-inp" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              {/* Trading Rules + Quick Stats */}
              <div className="card" style={{ opacity: 1, transform: 'none' }}>
                <h4 style={{ color: '#818cf8', fontSize: 13, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>📚 Your Trading Rules</h4>
                {[
                  { icon: '🚀', rule: 'Ride the momentum — trend is your friend' },
                  { icon: '🧱', rule: 'Never skip Stop Loss — ever!' },
                  { icon: '😌', rule: 'Keep it slow — no FOMO trades' },
                  { icon: '📐', rule: 'Always plan Entry, Exit & Stop before trade' },
                  { icon: '⏳', rule: 'Wait for confirmation before entry' },
                  { icon: '💰', rule: 'Risk only 1-2% of capital per trade' },
                  { icon: '📝', rule: 'Journal every trade — good or bad' },
                  { icon: '🧘', rule: 'Take breaks after 2-3 consecutive losses' },
                  { icon: '📊', rule: 'Do full analysis before going aggressive' },
                  { icon: '🎯', rule: 'Without setup = without analysis = no trade' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{r.icon}</span>
                    <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.6 }}>{r.rule}</p>
                  </div>
                ))}

                {/* Quick Stats */}
                <div style={{ marginTop: 16, padding: 14, background: 'rgba(34,211,238,0.05)', borderRadius: 12, border: '1px solid rgba(34,211,238,0.15)' }}>
                  <h4 style={{ color: '#22d3ee', fontSize: 12, marginBottom: 10 }}>📈 Your Quick Stats</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#64748b', fontSize: 10 }}>Win Rate</p>
                      <p style={{ color: '#22c55e', fontSize: 18, fontWeight: 800 }}>{winRate}%</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#64748b', fontSize: 10 }}>Avg R:R</p>
                      <p style={{ color: '#22d3ee', fontSize: 18, fontWeight: 800 }}>{avgRR}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#64748b', fontSize: 10 }}>Total Trades</p>
                      <p style={{ color: '#fff', fontSize: 18, fontWeight: 800 }}>{trades.length}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#64748b', fontSize: 10 }}>Total P&L</p>
                      <p style={{ color: totalPnl >= 0 ? '#22c55e' : '#ef4444', fontSize: 18, fontWeight: 800 }}>₹{totalPnl.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .container { min-height: 100vh; background: #020617; color: white; font-family: 'Poppins', sans-serif; position: relative; overflow-x: hidden; }
        .bg-grid { position: fixed; width: 200%; height: 200%; background-image: linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px); background-size: 50px 50px; animation: gridMove 20s linear infinite; z-index: 0; }
        @keyframes gridMove { from { transform: translate(0,0); } to { transform: translate(-50px,-50px); } }
        .glow { position: fixed; border-radius: 50%; filter: blur(120px); opacity: 0.12; z-index: 0; }
        .g1 { width: 400px; height: 400px; background: #6366f1; top: -100px; left: -100px; }
        .g2 { width: 300px; height: 300px; background: #22d3ee; bottom: 0; right: -100px; }

        .header { position: sticky; top: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center; padding: 14px 32px; background: rgba(2,6,23,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); gap: 16px; flex-wrap: wrap; }
        .logo-wrap { display: flex; align-items: center; gap: 8px; }
        .logo-text { font-size: 18px; font-weight: 800; }
        .logo-emp { background: linear-gradient(90deg, #6366f1, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .tabs { display: flex; gap: 8px; }
        .tab { padding: 8px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: transparent; color: #64748b; cursor: pointer; font-size: 13px; font-family: 'Poppins', sans-serif; transition: 0.2s; white-space: nowrap; }
        .tab.active { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.4); color: #818cf8; }
        .back-btn { padding: 8px 14px; border-radius: 10px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #818cf8; cursor: pointer; font-size: 13px; font-family: 'Poppins', sans-serif; transition: 0.2s; white-space: nowrap; }
        .back-btn:hover { background: #6366f1; color: white; }

        .stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; padding: 20px 32px 0; position: relative; z-index: 1; opacity: 0; transform: translateY(20px); transition: all 0.6s; }
        .stats.show { opacity: 1; transform: translateY(0); }
        .stat-card { padding: 16px; border-radius: 16px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); text-align: center; }
        .stat-icon { font-size: 20px; }
        .stat-label { color: #64748b; font-size: 11px; margin: 4px 0 2px; }
        .stat-value { font-size: 20px; font-weight: 800; }

        .content { position: relative; z-index: 1; padding: 20px 32px 60px; max-width: 1400px; margin: auto; }
        .show { opacity: 1 !important; transform: translateY(0) !important; }

        .card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 24px; margin-bottom: 20px; opacity: 1; transform: translateY(0); transition: all 0.6s; }
        .card.show { opacity: 1; transform: translateY(0); }
        .card-title { font-size: 15px; font-weight: 700; color: #94a3b8; margin-bottom: 20px; }
        .section-label { font-size: 12px; font-weight: 600; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; margin: 16px 0 10px; }

        .form-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 8px; }
        .form-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 8px; }
        .form-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 8px; }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field label { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .inp { padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); color: white; font-size: 13px; font-family: 'Poppins', sans-serif; outline: none; transition: 0.3s; width: 100%; resize: vertical; }
        .inp:focus { border-color: #6366f1; box-shadow: 0 0 12px rgba(99,102,241,0.2); background: rgba(99,102,241,0.06); }
        .inp option { background: #0f172a; }
        .inp-entry:focus { border-color: #6366f1; }
        .inp-exit:focus { border-color: #22c55e; }
        .inp-stop:focus { border-color: #ef4444; }
        .inp-target:focus { border-color: #f59e0b; }

        .rr-preview { display: flex; gap: 16px; padding: 12px 16px; background: rgba(34,211,238,0.05); border: 1px solid rgba(34,211,238,0.15); border-radius: 12px; margin: 10px 0; flex-wrap: wrap; font-size: 13px; }

        .chip-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .chip { padding: 6px 12px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #64748b; cursor: pointer; font-size: 12px; font-family: 'Poppins', sans-serif; transition: 0.2s; }
        .chip:hover { border-color: #6366f1; color: #818cf8; }
        .chip-active { background: rgba(99,102,241,0.2) !important; border-color: #6366f1 !important; color: #818cf8 !important; }

        .add-btn { margin-top: 16px; padding: 12px 28px; border-radius: 12px; border: none; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-weight: 700; font-size: 14px; font-family: 'Poppins', sans-serif; cursor: pointer; transition: 0.3s; width: 100%; }
        .add-btn:hover { transform: scale(1.01); box-shadow: 0 0 25px rgba(99,102,241,0.4); }
        .add-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .error { color: #f87171; font-size: 13px; padding: 10px 14px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; margin-bottom: 12px; }

        .trade-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 14px 16px; margin-bottom: 10px; cursor: pointer; transition: 0.2s; }
        .trade-card:hover { border-color: rgba(99,102,241,0.3); }
        .trade-card-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .symbol-badge { padding: 4px 10px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); border-radius: 6px; color: #818cf8; font-weight: 700; font-size: 12px; }
        .type-badge { padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        .long { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; }
        .short { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; }
        .setup-badge { padding: 4px 10px; background: rgba(34,211,238,0.1); border: 1px solid rgba(34,211,238,0.2); border-radius: 6px; color: #22d3ee; font-size: 12px; }
        .setup-chip { font-size: 12px; color: #22d3ee; }
        .pnl-val { font-weight: 700; font-size: 14px; margin-left: auto; }
        .profit { color: #22c55e; }
        .loss { color: #ef4444; }
        .del-btn { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; padding: 5px 9px; cursor: pointer; font-size: 13px; transition: 0.2s; }
        .del-btn:hover { background: #ef4444; }
        .date-val { color: #64748b; font-size: 12px; }
        .no-data { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 40px; color: #475569; text-align: center; }

        .trade-detail { margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.06); }
        .detail-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 10px; }
        .detail-item { display: flex; flex-direction: column; gap: 2px; }
        .dl { font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .dv { font-size: 13px; font-weight: 600; color: #e2e8f0; }
        .psych-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 10px; }
        .psych-badge { padding: 5px 12px; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: 20px; font-size: 12px; color: #818cf8; }
        .note-box { padding: 10px 14px; background: rgba(255,255,255,0.02); border-left: 3px solid rgba(99,102,241,0.4); border-radius: 8px; font-size: 13px; color: #94a3b8; margin-bottom: 8px; line-height: 1.6; }
        .nl { font-weight: 600; }

        .desktop-table { display: block; }
        .mobile-trades { display: none; }
        .table-scroll { overflow-x: auto; }
        .table { width: 100%; border-collapse: collapse; min-width: 900px; }
        .th { padding: 10px 14px; text-align: left; color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.06); white-space: nowrap; }
        .tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.2s; }
        .tr:hover { background: rgba(255,255,255,0.03); }
        .td { padding: 12px 14px; font-size: 13px; color: #e2e8f0; white-space: nowrap; }

        .trade-detail-desktop { margin-top: 16px; padding: 20px; background: rgba(99,102,241,0.05); border: 1px solid rgba(99,102,241,0.15); border-radius: 16px; }
        .detail-grid-desktop { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }

        /* CALENDAR */
        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
        .cal-day-label { text-align: center; font-size: 11px; color: #64748b; font-weight: 600; padding: 8px 0; text-transform: uppercase; }
        .cal-cell { min-height: 80px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); padding: 8px; display: flex; flex-direction: column; gap: 2px; transition: 0.2s; }
        .cal-cell.empty { background: transparent; border-color: transparent; }
        .cal-cell.profit-day { background: rgba(34,197,94,0.08); border-color: rgba(34,197,94,0.2); }
        .cal-cell.loss-day { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2); }
        .cal-cell.today { border-color: #6366f1 !important; box-shadow: 0 0 12px rgba(99,102,241,0.2); }
        .cal-date { font-size: 13px; font-weight: 700; color: #94a3b8; }
        .cal-pnl { font-size: 11px; font-weight: 700; }
        .cal-count { font-size: 10px; color: #64748b; }
        .cal-notrade { font-size: 10px; color: #334155; margin-top: auto; }
        .cal-nav { padding: 6px 14px; border-radius: 8px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #818cf8; cursor: pointer; font-size: 16px; transition: 0.2s; }
        .cal-nav:hover { background: #6366f1; color: white; }

        .monthly-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px; }
        .ms-item { padding: 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; text-align: center; }
        .ms-label { font-size: 11px; color: #64748b; display: block; margin-bottom: 4px; }
        .ms-value { font-size: 20px; font-weight: 800; color: #fff; }

        /* SIMULATOR */
        .sim-btn { padding: 6px 14px; border-radius: 8px; background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); color: #818cf8; cursor: pointer; font-size: 12px; font-family: 'Poppins', sans-serif; transition: 0.2s; }
        .sim-btn:hover { background: #6366f1; color: white; }
        .checklist-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); cursor: pointer; font-size: 13px; color: #94a3b8; }
        .check-inp { width: 16px; height: 16px; accent-color: #6366f1; cursor: pointer; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .stats { grid-template-columns: repeat(3, 1fr); }
          .form-grid-4 { grid-template-columns: repeat(2, 1fr); }
          .form-grid-3 { grid-template-columns: repeat(2, 1fr); }
          .detail-grid-desktop { grid-template-columns: repeat(3, 1fr); }
          .monthly-summary { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .header { padding: 12px 16px; }
          .tabs { gap: 4px; }
          .tab { padding: 7px 10px; font-size: 11px; }
          .content { padding: 16px 16px 60px; }
          .stats { grid-template-columns: repeat(2, 1fr); padding: 16px 16px 0; }
          .card { padding: 16px; }
          .form-grid-3 { grid-template-columns: 1fr; }
          .form-grid-4 { grid-template-columns: 1fr 1fr; }
          .form-grid-2 { grid-template-columns: 1fr; }
          .detail-grid { grid-template-columns: repeat(2, 1fr); }
          .desktop-table { display: none; }
          .mobile-trades { display: block; }
          .cal-cell { min-height: 60px; padding: 6px; }
          .cal-date { font-size: 11px; }
          .cal-pnl { font-size: 10px; }
          .monthly-summary { grid-template-columns: repeat(2, 1fr); }
          .rr-preview { flex-direction: column; gap: 8px; }
          #tv-widget { height: 400px !important; }
        }

        @media (max-width: 480px) {
          .stats { grid-template-columns: repeat(2, 1fr); }
          .form-grid-4 { grid-template-columns: 1fr; }
          .cal-cell { min-height: 50px; }
          .cal-day-label { font-size: 9px; }
          .tabs { overflow-x: auto; }
        }
      `}</style>
    </div>
  );
}