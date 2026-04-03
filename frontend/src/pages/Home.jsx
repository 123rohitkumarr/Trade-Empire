import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: '📒', title: 'Smart Trade Journal', desc: 'Log every trade instantly. Auto P&L calculation. Never miss a detail.' },
  { icon: '📊', title: 'Advanced Analytics', desc: 'Beautiful charts. Win rate, drawdown, profit factor — all in one place.' },
  { icon: '🤖', title: 'AI-Powered Insights', desc: 'Get personalized coaching from AI based on your actual trading data.' },
  { icon: '🔒', title: 'Bank-Grade Security', desc: 'JWT authentication. Your data is encrypted and completely private.' },
  { icon: '⚡', title: 'Real-Time Updates', desc: 'Instant trade updates. Live P&L tracking as markets move.' },
  { icon: '📱', title: 'Works Everywhere', desc: 'Desktop, tablet, mobile — trade journaling on any device.' },
];

export default function Home() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsVisible(true);
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { background: #030712; }
      @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
      @keyframes pulse-glow { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
      @keyframes slide-up { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
      @keyframes slide-in-right { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
      @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
      @keyframes count-up { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }
      .hero-title { animation: slide-up 0.8s ease forwards; }
      .hero-sub { animation: slide-up 0.8s 0.2s ease both; }
      .hero-btns { animation: slide-up 0.8s 0.4s ease both; }
      .hero-img { animation: slide-in-right 0.8s 0.3s ease both; }
      .feature-card:hover { transform: translateY(-8px) !important; border-color: #22d3ee !important; }
      .nav-link:hover { color: #22d3ee !important; }
      .btn-primary:hover { background: #0891b2 !important; transform: translateY(-2px); box-shadow: 0 0 30px rgba(34,211,238,0.4) !important; }
      .btn-secondary:hover { background: rgba(34,211,238,0.1) !important; border-color: #22d3ee !important; }
      .ticker-wrap { overflow: hidden; white-space: nowrap; background: rgba(34,211,238,0.05); border-top: 1px solid rgba(34,211,238,0.1); border-bottom: 1px solid rgba(34,211,238,0.1); padding: 12px 0; }
      .ticker-inner { display: inline-block; animation: ticker 20s linear infinite; }
      .grid-bg { background-image: linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px); background-size: 60px 60px; }
      .mobile-menu { display: none; }

      @media (max-width: 1024px) {
        .hero-section { padding: 50px 40px !important; }
        .hero-title { font-size: 46px !important; }
        .section-pad { padding: 60px 40px !important; }
      }

      @media (max-width: 768px) {
        .hero-section { flex-direction: column !important; padding: 40px 20px !important; text-align: center; gap: 40px; }
        .hero-title { font-size: 36px !important; letter-spacing: -1px !important; }
        .hero-sub { font-size: 15px !important; }
        .hero-img { display: none !important; }
        .hero-btns { flex-direction: column !important; align-items: center; width: 100%; }
        .hero-btns button { width: 100% !important; justify-content: center; }
        .hero-checks { flex-direction: column !important; align-items: center; gap: 10px !important; }
        .nav-links-desktop { display: none !important; }
        .nav-btns-desktop { display: none !important; }
        .mobile-menu-btn { display: flex !important; }
        .mobile-menu { display: flex; flex-direction: column; position: fixed; top: 64px; left: 0; right: 0; background: rgba(3,7,18,0.98); backdrop-filter: blur(20px); padding: 20px; gap: 16px; border-bottom: 1px solid rgba(34,211,238,0.1); z-index: 99; }
        .section-pad { padding: 60px 20px !important; }
        .features-grid { grid-template-columns: 1fr !important; }
        .cta-title { font-size: 36px !important; }
        .footer-inner { flex-direction: column !important; align-items: center !important; text-align: center; padding: 30px 20px !important; gap: 16px !important; }
        .footer-links { flex-wrap: wrap !important; justify-content: center !important; }
        .badge-text { font-size: 10px !important; letter-spacing: 1px !important; }
      }

      @media (max-width: 480px) {
        .hero-title { font-size: 30px !important; }
        .section-pad { padding: 40px 16px !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#030712', color: '#fff', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrollY > 50 ? 'rgba(3,7,18,0.95)' : 'transparent',
        backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 50 ? '1px solid rgba(34,211,238,0.1)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #22d3ee, #0891b2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📈</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20, letterSpacing: '-0.5px' }}>TradeEmpire 👑</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="nav-links-desktop" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Features', 'About', 'Contact'].map(item => (
            <span key={item} className="nav-link"
              onClick={() => navigate(`/${item.toLowerCase()}`)}
              style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer', transition: 'color 0.2s', fontWeight: 500 }}>
              {item}
            </span>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="nav-btns-desktop" style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" onClick={() => navigate('/login')}
            style={{ padding: '9px 20px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(148,163,184,0.3)', color: '#fff', fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>
            Login
          </button>
          <button className="btn-primary" onClick={() => navigate('/register')}
            style={{ padding: '9px 20px', borderRadius: 10, background: '#22d3ee', border: 'none', color: '#030712', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>
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
            style={{ padding: '12px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(148,163,184,0.3)', color: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Login
          </button>
          <button onClick={() => { navigate('/register'); setMenuOpen(false); }}
            style={{ padding: '12px', borderRadius: 10, background: '#22d3ee', border: 'none', color: '#030712', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
            Start Free →
          </button>
        </div>
      )}

      {/* Ticker */}
      <div style={{ marginTop: 68 }} className="ticker-wrap">
        <div className="ticker-inner">
          {['RELIANCE +2.4%', 'NIFTY 50 +0.8%', 'TCS +1.2%', 'HDFC +0.6%', 'INFY -0.3%', 'SENSEX +1.1%', 'WIPRO +2.1%', 'BAJFINANCE +3.2%', 'ICICIBANK +1.8%', 'SBIN +0.9%',
            'RELIANCE +2.4%', 'NIFTY 50 +0.8%', 'TCS +1.2%', 'HDFC +0.6%', 'INFY -0.3%', 'SENSEX +1.1%', 'WIPRO +2.1%', 'BAJFINANCE +3.2%', 'ICICIBANK +1.8%', 'SBIN +0.9%'].map((t, i) => (
            <span key={i} style={{ marginRight: 40, fontSize: 12, color: t.includes('-') ? '#f87171' : '#4ade80', fontWeight: 500 }}>● {t}</span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="grid-bg hero-section" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', padding: '60px 80px', position: 'relative', overflow: 'hidden', gap: 40 }}>
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulse-glow 4s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%', animation: 'pulse-glow 4s 2s ease-in-out infinite' }} />

        <div style={{ flex: 1, maxWidth: 620, zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 100, padding: '6px 16px', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, background: '#22d3ee', borderRadius: '50%', display: 'inline-block', animation: 'pulse-glow 1.5s infinite' }} />
            <span className="badge-text" style={{ fontSize: 12, color: '#22d3ee', fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>India's #1 Trading Empire 👑</span>
          </div>

          <h1 className="hero-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: 58, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 24 }}>
            Trade Smarter.<br />
            <span style={{ background: 'linear-gradient(90deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Profit Better.</span>
          </h1>

          <p className="hero-sub" style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.7, marginBottom: 40, fontWeight: 300 }}>
            The AI-powered trading journal that analyzes your patterns, tracks your P&L, and tells you exactly what to fix — in plain Hindi and English.
          </p>

          <div className="hero-btns" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/register')}
              style={{ padding: '14px 32px', borderRadius: 12, background: '#22d3ee', border: 'none', color: '#030712', fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 0 20px rgba(34,211,238,0.3)' }}>
              Start for Free — No Credit Card →
            </button>
            <button className="btn-secondary" onClick={() => navigate('/login')}
              style={{ padding: '14px 32px', borderRadius: 12, background: 'transparent', border: '1px solid rgba(148,163,184,0.3)', color: '#fff', fontSize: 16, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>
              Login to Dashboard
            </button>
          </div>

          <div className="hero-checks" style={{ display: 'flex', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
            {['No credit card', 'Free forever plan', 'Setup in 2 minutes'].map((t, i) => (
              <span key={i} style={{ fontSize: 13, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 6 }}>✓ {t}</span>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-img" style={{ flex: 1, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
          <div style={{ width: 480, background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 24, padding: 24, backdropFilter: 'blur(20px)', boxShadow: '0 0 80px rgba(34,211,238,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14 }}>📈 Live Portfolio</span>
              <span style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', fontSize: 12, padding: '4px 10px', borderRadius: 100, border: '1px solid rgba(74,222,128,0.2)' }}>● Live</span>
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>Total P&L Today</p>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: '#4ade80' }}>+₹24,680</h2>
            </div>
            {[
              { symbol: 'RELIANCE', type: 'LONG', pnl: '+₹8,400', color: '#4ade80' },
              { symbol: 'TCS', type: 'LONG', pnl: '+₹12,280', color: '#4ade80' },
              { symbol: 'INFY', type: 'SHORT', pnl: '-₹2,100', color: '#f87171' },
              { symbol: 'HDFC', type: 'LONG', pnl: '+₹6,100', color: '#4ade80' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, background: 'rgba(34,211,238,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📊</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600 }}>{t.symbol}</p>
                    <p style={{ fontSize: 11, color: '#64748b' }}>{t.type}</p>
                  </div>
                </div>
                <span style={{ color: t.color, fontWeight: 700, fontSize: 14 }}>{t.pnl}</span>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(34,211,238,0.05)', borderRadius: 12, border: '1px solid rgba(34,211,238,0.1)' }}>
              <p style={{ fontSize: 12, color: '#22d3ee' }}>🤖 AI Insight: Your LONG trades are 3x more profitable than SHORTs. Focus on momentum plays!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-pad" style={{ padding: '100px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={{ fontSize: 12, color: '#22d3ee', fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>Everything You Need</span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 44, fontWeight: 800, marginTop: 12, letterSpacing: '-1px' }}>Built for Serious Traders</h2>
          <p style={{ color: '#64748b', fontSize: 16, marginTop: 12 }}>From Zerodha to SBI — import your trades and get insights instantly</p>
        </div>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="feature-card" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '28px 24px', transition: 'all 0.3s ease', cursor: 'default' }}>
              <div style={{ width: 52, height: 52, background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-pad" style={{ padding: '100px 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(34,211,238,0.06) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 className="cta-title" style={{ fontFamily: "'Syne', sans-serif", fontSize: 52, fontWeight: 800, letterSpacing: '-2px', marginBottom: 20 }}>
            Ready to Trade<br />
            <span style={{ background: 'linear-gradient(90deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Like a Pro?</span>
          </h2>
          <p style={{ color: '#64748b', fontSize: 18, marginBottom: 40 }}>Join 10,000+ traders who improved their performance with TradeEmpire 👑</p>
          <button className="btn-primary" onClick={() => navigate('/register')}
            style={{ padding: '16px 48px', borderRadius: 14, background: '#22d3ee', border: 'none', color: '#030712', fontSize: 18, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 0 40px rgba(34,211,238,0.3)' }}>
            Start Free Today →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-inner" style={{ padding: '40px 80px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #22d3ee, #0891b2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📈</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18 }}>TradeEmpire👑</span>
        </div>
        <p style={{ color: '#475569', fontSize: 13 }}>© 2026 TradeEmpire👑 || Built by Rohit Dhakad </p>
        <div className="footer-links" style={{ display: 'flex', gap: 24 }}>
          {['Features', 'About', 'Contact', 'Privacy'].map(link => (
            <span key={link} onClick={() => navigate(`/${link.toLowerCase()}`)}
              style={{ color: '#475569', fontSize: 13, cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#22d3ee'}
              onMouseLeave={e => e.target.style.color = '#475569'}>
              {link}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}