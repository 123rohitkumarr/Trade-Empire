import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Features() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      .feature-card:hover { border-color: #22d3ee !important; transform: translateY(-6px); }
      .btn-primary:hover { background: #0891b2 !important; transform: translateY(-2px); }
      .mobile-menu { display: none; }
      @media (max-width: 768px) {
        .nav-links-desktop { display: none !important; }
        .nav-btns-desktop { display: none !important; }
        .mobile-menu-btn { display: flex !important; }
        .mobile-menu { display: flex; flex-direction: column; position: fixed; top: 64px; left: 0; right: 0; background: rgba(3,7,18,0.98); backdrop-filter: blur(20px); padding: 20px; gap: 16px; border-bottom: 1px solid rgba(34,211,238,0.1); z-index: 99; }
        .features-content { padding: 40px 16px !important; }
        .features-hero h1 { font-size: 30px !important; letter-spacing: -1px !important; }
        .features-grid { grid-template-columns: 1fr !important; }
        .compare-header { padding: 12px 16px !important; }
        .compare-row { padding: 12px 16px !important; }
        .compare-row span:first-child { font-size: 12px !important; }
        .cta-box { padding: 40px 20px !important; }
        .cta-box h2 { font-size: 28px !important; }
        .footer-features { padding: 24px 20px !important; }
        .nav-pad { padding: 16px 20px !important; }
      }
      @media (max-width: 480px) {
        .features-hero h1 { font-size: 26px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const features = [
    { icon: '📒', title: 'Smart Trade Journal', desc: 'Log every trade in seconds. Buy price, sell price, quantity — auto P&L calculated instantly.', points: ['Auto P&L calculation', 'LONG & SHORT support', 'Add notes to every trade', 'Delete & manage trades'] },
    { icon: '📊', title: 'Advanced Analytics', desc: 'Deep dive into your performance with beautiful charts and real metrics that actually matter.', points: ['Cumulative P&L line chart', 'Win/Loss pie chart', 'Symbol-wise bar chart', 'Win rate & avg profit/loss'] },
    { icon: '🤖', title: 'AI-Powered Insights', desc: 'Our AI coach analyzes your actual trade data and gives you personalized, actionable advice.', points: ['Full portfolio analysis', 'Stop loss feedback', 'Pattern detection', 'Position sizing advice'] },
    { icon: '🔒', title: 'Bank-Grade Security', desc: 'Your trading data is sensitive. We treat it that way with industry-standard encryption.', points: ['JWT authentication', 'bcrypt password hashing', 'HTTPS encryption', 'No data selling — ever'] },
    { icon: '⚡', title: 'Blazing Fast Performance', desc: 'Built with React + Node.js + MongoDB for lightning fast load times. No lag, no delays.', points: ['React frontend', 'Node.js + Express backend', 'MongoDB Atlas cloud DB', 'Optimized API calls'] },
    { icon: '📱', title: 'Fully Responsive', desc: 'Trade journaling on any device. Desktop, laptop, tablet, or mobile — works perfectly everywhere.', points: ['Mobile optimized UI', 'Tablet friendly layout', 'Desktop dashboard', 'Works on all browsers'] },
    { icon: '📈', title: 'Live Stock Ticker', desc: 'Stay updated with a live-style ticker showing major Indian stocks and indices.', points: ['NIFTY 50 updates', 'SENSEX tracking', 'Top stock display', 'Real-time feel'] },
    { icon: '🧠', title: 'Pattern Detection', desc: 'The AI detects your trading habits — overtrading, loss streaks, best performing symbols.', points: ['Loss streak detection', 'Overtrading alerts', 'Best symbol analysis', 'Emotional trading flags'] },
    { icon: '🆓', title: 'Free Forever Plan', desc: 'Start completely free. No credit card. No hidden fees. Core features always free.', points: ['No credit card needed', 'Unlimited trades', 'Full AI access', 'No expiry'] },
  ];

  const comparison = [
    { feature: 'Trade Journal', us: true, others: false },
    { feature: 'Auto P&L Calculation', us: true, others: false },
    { feature: 'AI Insights', us: true, others: false },
    { feature: 'Pattern Detection', us: true, others: false },
    { feature: 'Indian Stock Focus', us: true, others: false },
    { feature: 'Free Forever', us: true, others: false },
    { feature: 'No Data Selling', us: true, others: false },
    { feature: 'Mobile Responsive', us: true, others: true },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#030712', color: '#fff', minHeight: '100vh' }}>

      {/* Nav */}
      <nav className="nav-pad" style={{ padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, background: 'rgba(3,7,18,0.95)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #22d3ee, #0891b2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📈</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20 }}>TradeEmpire 👑</span>
        </div>

        <div className="nav-links-desktop" style={{ display: 'flex', gap: 32 }}>
          {['Features', 'About', 'Contact'].map(item => (
            <span key={item} onClick={() => navigate(`/${item.toLowerCase()}`)}
              style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer', fontWeight: 500 }}>
              {item}
            </span>
          ))}
        </div>

        <div className="nav-btns-desktop" style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/login')}
            style={{ padding: '10px 20px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(148,163,184,0.3)', color: '#fff', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate('/register')}
            style={{ padding: '10px 24px', borderRadius: 10, background: '#22d3ee', border: 'none', color: '#030712', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Outfit', sans-serif" }}>
            Start Free →
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer', flexDirection: 'column', gap: 5, padding: 4 }}>
          <div style={{ width: 24, height: 2, background: menuOpen ? '#22d3ee' : '#fff', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <div style={{ width: 24, height: 2, background: menuOpen ? 'transparent' : '#fff', transition: 'all 0.3s' }} />
          <div style={{ width: 24, height: 2, background: menuOpen ? '#22d3ee' : '#fff', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {['Features', 'About', 'Contact'].map(item => (
            <span key={item} onClick={() => { navigate(`/${item.toLowerCase()}`); setMenuOpen(false); }}
              style={{ fontSize: 16, color: '#94a3b8', cursor: 'pointer', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {item}
            </span>
          ))}
          <button onClick={() => { navigate('/login'); setMenuOpen(false); }}
            style={{ padding: '12px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(148,163,184,0.3)', color: '#fff', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
            Login
          </button>
          <button onClick={() => { navigate('/register'); setMenuOpen(false); }}
            style={{ padding: '12px', borderRadius: 10, background: '#22d3ee', border: 'none', color: '#030712', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
            Start Free →
          </button>
        </div>
      )}

      <div className="features-content" style={{ maxWidth: 1100, margin: 'auto', padding: '70px 40px' }}>

        {/* Header */}
        <div className="features-hero" style={{ textAlign: 'center', marginBottom: 70 }}>
          <span style={{ fontSize: 12, color: '#22d3ee', fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>What You Get</span>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 52, fontWeight: 800, marginTop: 16, letterSpacing: '-2px', lineHeight: 1.1 }}>
            Every Feature You Need<br />
            <span style={{ background: 'linear-gradient(90deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>to Trade Like a Pro 👑</span>
          </h1>
          <p style={{ color: '#64748b', marginTop: 20, fontSize: 16, lineHeight: 1.7, maxWidth: 600, margin: '20px auto 0' }}>
            TradeEmpire is packed with powerful tools designed specifically for Indian traders — from beginners to pros.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 80 }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '28px 24px', transition: 'all 0.3s ease' }}>
              <div style={{ width: 52, height: 52, background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 18 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7, marginBottom: 14 }}>{f.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {f.points.map((p, j) => (
                  <span key={j} style={{ fontSize: 13, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 16, height: 16, background: 'rgba(74,222,128,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>✓</span>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div style={{ marginBottom: 80, overflowX: 'auto' }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 800, textAlign: 'center', marginBottom: 40, letterSpacing: '-1px' }}>
            TradeEmpire vs Others
          </h2>
          <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden', minWidth: 320 }}>
            <div className="compare-header" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'rgba(34,211,238,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 28px' }}>
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Feature</span>
              <span style={{ fontSize: 13, color: '#22d3ee', fontWeight: 700, textAlign: 'center' }}>TradeEmpire 👑</span>
              <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, textAlign: 'center' }}>Other Tools</span>
            </div>
            {comparison.map((c, i) => (
              <div key={i} className="compare-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '14px 28px', borderBottom: i < comparison.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                <span style={{ fontSize: 13, color: '#cbd5e1' }}>{c.feature}</span>
                <span style={{ textAlign: 'center', fontSize: 18 }}>{c.us ? '✅' : '❌'}</span>
                <span style={{ textAlign: 'center', fontSize: 18 }}>{c.others ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="cta-box" style={{ textAlign: 'center', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 24, padding: '60px 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(34,211,238,0.05) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 16 }}>
              Ready to experience<br />
              <span style={{ background: 'linear-gradient(90deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>all these features?</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, marginBottom: 36 }}>Join thousands of traders who are already trading smarter.</p>
            <button className="btn-primary" onClick={() => navigate('/register')}
              style={{ padding: '14px 48px', borderRadius: 12, background: '#22d3ee', border: 'none', color: '#030712', fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', fontFamily: "'Outfit', sans-serif", boxShadow: '0 0 40px rgba(34,211,238,0.25)' }}>
              Start Free — No Credit Card →
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-features" style={{ padding: '30px 60px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ color: '#475569', fontSize: 13 }}>© 2026 TradeEmpire👑 || Built by Rohit Dhakad </p>
      </footer>
    </div>
  );
}