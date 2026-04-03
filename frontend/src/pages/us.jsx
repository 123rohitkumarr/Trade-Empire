import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function About() {
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

      * { margin: 0; padding: 0; box-sizing: border-box; }

      .btn-primary:hover { background: #0891b2 !important; transform: translateY(-2px); }
      .value-card:hover { border-color: #22d3ee !important; transform: translateY(-4px); }
      .btn-primary { transition: all 0.2s; }
      .value-card { transition: all 0.3s; }

      /* ── Nav ── */
      .about-nav {
        padding: 20px 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        gap: 16px;
      }
      .about-nav-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        flex-shrink: 0;
      }
      .about-nav-buttons {
        display: flex;
        gap: 10px;
        flex-shrink: 0;
      }

      /* ── Sections ── */
      .about-hero {
        padding: 80px 60px;
        text-align: center;
        max-width: 860px;
        margin: auto;
      }
      .about-hero h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 52px;
        font-weight: 800;
        margin-top: 16px;
        letter-spacing: -2px;
        line-height: 1.1;
      }
      .about-hero p {
        color: #64748b;
        font-size: 18px;
        margin-top: 24px;
        line-height: 1.9;
      }

      .about-founder-section {
        padding: 20px 60px 60px;
        display: flex;
        justify-content: center;
      }
      .about-founder-card {
        background: rgba(15,23,42,0.8);
        border: 1px solid rgba(34,211,238,0.2);
        border-radius: 24px;
        padding: 36px 48px;
        max-width: 560px;
        width: 100%;
        text-align: center;
        box-shadow: 0 0 60px rgba(34,211,238,0.05);
      }

      .about-values-section {
        padding: 60px;
        background: rgba(15,23,42,0.4);
      }
      .about-values-section h2 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 36px;
        font-weight: 800;
        text-align: center;
        margin-bottom: 48px;
        letter-spacing: -1px;
      }
      .about-values-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
        max-width: 1000px;
        margin: auto;
      }

      .about-cta-section {
        padding: 60px;
        text-align: center;
        border-top: 1px solid rgba(255,255,255,0.05);
      }
      .about-cta-section h2 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 36px;
        font-weight: 800;
        margin-bottom: 16px;
      }

      .about-footer {
        padding: 30px 60px;
        border-top: 1px solid rgba(255,255,255,0.05);
        text-align: center;
      }

      /* ── Tablet (≤ 768px) ── */
      @media (max-width: 768px) {
        .about-nav { padding: 14px 20px; flex-wrap: wrap; }
        .about-nav-logo span { font-size: 17px !important; }

        .about-hero { padding: 56px 24px; }
        .about-hero h1 { font-size: 36px !important; letter-spacing: -1px !important; }
        .about-hero p { font-size: 15px !important; }

        .about-founder-section { padding: 16px 20px 48px; }
        .about-founder-card { padding: 28px 24px; }

        .about-values-section { padding: 48px 20px; }
        .about-values-section h2 { font-size: 28px !important; margin-bottom: 32px; }

        .about-cta-section { padding: 48px 20px; }
        .about-cta-section h2 { font-size: 28px !important; }

        .about-footer { padding: 24px 20px; }
      }

      /* ── Mobile (≤ 480px) ── */
      @media (max-width: 480px) {
        .about-nav { padding: 12px 16px; }
        .about-nav-buttons button { padding: 8px 14px !important; font-size: 13px !important; }

        .about-hero { padding: 40px 16px; }
        .about-hero h1 { font-size: 28px !important; letter-spacing: -0.5px !important; }
        .about-hero p { font-size: 14px !important; margin-top: 16px; }

        .about-founder-section { padding: 12px 16px 40px; }
        .about-founder-card { padding: 24px 16px; border-radius: 18px; }

        .about-values-section { padding: 36px 16px; }
        .about-values-section h2 { font-size: 24px !important; }
        .about-values-grid { grid-template-columns: 1fr; gap: 14px; }

        .about-cta-section { padding: 40px 16px; }
        .about-cta-section h2 { font-size: 24px !important; }

        .about-footer { padding: 20px 16px; }
      }

      /* ── Very small (≤ 360px) ── */
      @media (max-width: 360px) {
        .about-hero h1 { font-size: 24px !important; }
        .about-nav-logo span { display: none; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const values = [
    { icon: '🎯', title: 'Trader First', desc: 'Every feature is built by asking: does this make traders more profitable?' },
    { icon: '🔒', title: 'Privacy Always', desc: 'Your trading data is yours. We never sell it. Never share it.' },
    { icon: '🇮🇳', title: 'Made for India', desc: 'Built for NSE/BSE. Supports Zerodha, SBI, Groww imports.' },
    { icon: '🤝', title: 'Community Driven', desc: 'Our features come from trader feedback. You shape the product.' },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#030712', color: '#fff', minHeight: '100vh' }}>

      {/* Nav */}
      <nav className="about-nav">
        <div className="about-nav-logo" onClick={() => navigate('/')}>
          <div style={{
            width: 36, height: 36, flexShrink: 0,
            background: 'linear-gradient(135deg, #22d3ee, #0891b2)',
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18
          }}>📈</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20 }}>
            TradeEmpire 👑
          </span>
        </div>
        <div className="about-nav-buttons">
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 20px', borderRadius: 10,
              background: 'transparent', border: '1px solid rgba(148,163,184,0.3)',
              color: '#fff', cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif", fontSize: 14, whiteSpace: 'nowrap'
            }}>
            Login
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate('/register')}
            style={{
              padding: '10px 22px', borderRadius: 10,
              background: '#22d3ee', border: 'none',
              color: '#030712', fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Outfit', sans-serif", fontSize: 14, whiteSpace: 'nowrap'
            }}>
            Start Free →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="about-hero">
        <span style={{ fontSize: 12, color: '#22d3ee', fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>
          🔥 Why I Built This
        </span>
        <h1>
          Built by a trader,<br />
          <span style={{
            background: 'linear-gradient(90deg, #22d3ee, #818cf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            for real traders. 🚀
          </span>
        </h1>
        <p>
          I built this platform after realizing most traders lose not because of the market, but because of poor
          tracking and discipline. I wanted a place where every trade tells a story and every mistake becomes a
          lesson. This isn't just a tool — it's a system to think smarter and trade better. From confusion to
          clarity — that's the goal.{' '}
          <strong style={{ color: '#94a3b8' }}>This is where real traders are built. 🚀</strong>
        </p>
      </section>

      {/* Founder Card */}
      <section className="about-founder-section">
        <div className="about-founder-card">
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg, #22d3ee, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 20px', fontWeight: 800,
            color: '#030712', fontFamily: "'Space Grotesk', sans-serif"
          }}>
            RD
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 800 }}>
            Rohit Dhakad
          </h2>
          <p style={{ color: '#22d3ee', fontSize: 14, margin: '6px 0 20px', fontWeight: 500 }}>
            Founder & Developer · Jaipur, India 🇮🇳
          </p>
          <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
            A passionate developer and trader from Jaipur who turned his trading frustrations into a
            full-stack product. Building in public, learning every day.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="mailto:krohit41122@gmail.com"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 10,
                background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)',
                color: '#22d3ee', fontSize: 13, textDecoration: 'none', fontWeight: 500,
                wordBreak: 'break-all'
              }}>
              📧 krohit41122@gmail.com
            </a>
            <a
              href="https://instagram.com/r_d_rohit_dhakad"
              target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 16px', borderRadius: 10,
                background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
                color: '#a78bfa', fontSize: 13, textDecoration: 'none', fontWeight: 500
              }}>
              📸 @r_d_rohit_dhakad
            </a>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values-section">
        <h2>What We Believe In</h2>
        <div className="about-values-grid">
          {values.map((v, i) => (
            <div
              key={i}
              className="value-card"
              style={{
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 20, padding: 28, cursor: 'default'
              }}>
              <span style={{ fontSize: 32 }}>{v.icon}</span>
              <h3 style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 18, fontWeight: 700, margin: '14px 0 10px'
              }}>
                {v.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <h2>Join the Empire 👑</h2>
        <p style={{ color: '#64748b', marginBottom: 32, fontSize: 16 }}>
          Be part of India's fastest growing trading community.
        </p>
        <button
          className="btn-primary"
          onClick={() => navigate('/register')}
          style={{
            padding: '14px 40px', borderRadius: 12,
            background: '#22d3ee', border: 'none',
            color: '#030712', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', fontFamily: "'Outfit', sans-serif"
          }}>
          Start Free Today →
        </button>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <p style={{ color: '#475569', fontSize: 13 }}>
          © 2026 TradeEmpire 👑 || Built by Rohit Dhakad
        </p>
      </footer>
    </div>
  );
}