import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Privacy() {
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

      * { margin: 0; padding: 0; box-sizing: border-box; }

      .policy-card { transition: border-color 0.2s, transform 0.2s; }
      .policy-card:hover {
        border-color: rgba(34,211,238,0.4) !important;
        transform: translateY(-2px);
      }

      /* ── Desktop (default) ── */
      .privacy-nav {
        padding: 20px 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        gap: 16px;
      }
      .privacy-nav-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
        flex-shrink: 0;
      }
      .privacy-nav-buttons {
        display: flex;
        gap: 10px;
        flex-shrink: 0;
      }
      .privacy-content {
        max-width: 900px;
        margin: auto;
        padding: 70px 40px;
      }
      .privacy-h1 {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 48px;
        font-weight: 800;
        margin-top: 16px;
        letter-spacing: -1.5px;
      }
      .trust-banner {
        background: rgba(34,211,238,0.05);
        border: 1px solid rgba(34,211,238,0.15);
        border-radius: 20px;
        padding: 24px 32px;
        margin-bottom: 48px;
        display: flex;
        gap: 20px;
        align-items: center;
        flex-wrap: wrap;
      }
      .privacy-footer {
        padding: 30px 60px;
        border-top: 1px solid rgba(255,255,255,0.05);
        text-align: center;
      }

      /* ── Tablet (≤ 768px) ── */
      @media (max-width: 768px) {
        .privacy-nav {
          padding: 14px 20px;
          flex-wrap: wrap;
        }
        .privacy-nav-logo span { font-size: 17px !important; }
        .privacy-content { padding: 48px 20px; }
        .privacy-h1 { font-size: 36px !important; letter-spacing: -1px !important; }
        .trust-banner { padding: 20px; }
        .privacy-footer { padding: 24px 20px; }
      }

      /* ── Mobile (≤ 480px) ── */
      @media (max-width: 480px) {
        .privacy-nav {
          padding: 12px 16px;
        }
        .privacy-nav-buttons button {
          padding: 8px 14px !important;
          font-size: 13px !important;
        }
        .privacy-content { padding: 36px 16px; }
        .privacy-h1 {
          font-size: 28px !important;
          letter-spacing: -0.5px !important;
        }
        .trust-banner {
          padding: 16px;
          gap: 14px;
        }
        .trust-banner-emoji { font-size: 30px !important; }
        .policy-card { padding: 18px 16px !important; }
        .policy-card-icon { font-size: 22px !important; }
        .policy-card h3 { font-size: 15px !important; }
        .policy-card p { font-size: 13px !important; }
        .privacy-contact-box { padding: 24px 16px !important; }
        .privacy-contact-box h3 { font-size: 18px !important; }
        .privacy-footer { padding: 20px 16px; }
        .privacy-header-sub { font-size: 14px !important; }
      }

      /* ── Very small (≤ 360px) ── */
      @media (max-width: 360px) {
        .privacy-h1 { font-size: 24px !important; }
        .privacy-nav-logo span { display: none; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const policies = [
    {
      icon: '🔒',
      title: 'Your Data is Yours — Always',
      content: 'All trade data, personal information, and account details you enter on TradeEmpire belong exclusively to you. We do not claim any ownership over your data. You can export or delete your data at any time.'
    },
    {
      icon: '🚫',
      title: 'We Never Sell Your Data',
      content: 'TradeEmpire does not sell, rent, or trade your personal information or trading data to any third party — ever. Your financial data is sensitive and we treat it that way.'
    },
    {
      icon: '🛡️',
      title: 'Bank-Grade Encryption',
      content: 'All passwords are encrypted using bcrypt hashing. All API communications use JWT tokens. Your data is transmitted over HTTPS/SSL encryption at all times. We follow industry-standard security practices.'
    },
    {
      icon: '📊',
      title: 'What Data We Collect',
      content: 'We collect only what is necessary: your name, email address, and the trade data you manually enter. We do not access your broker accounts, bank accounts, or any financial data outside of what you provide us.'
    },
    {
      icon: '🍪',
      title: 'Cookies & Local Storage',
      content: 'We use browser local storage only to keep you logged in via JWT tokens. We do not use tracking cookies or third-party analytics cookies. Your session data stays on your device.'
    },
    {
      icon: '🤖',
      title: 'AI & Your Trade Data',
      content: 'When you use our AI Insights feature, your trade summary is sent to Groq AI for analysis. Only aggregated stats (win rate, P&L, symbols) are sent — never your personal details. AI responses are not stored permanently.'
    },
    {
      icon: '📧',
      title: 'Communications',
      content: 'We will never spam you. We may send important account-related emails only (password resets, security alerts). You can contact us anytime to opt out of any communication.'
    },
    {
      icon: '🔄',
      title: 'Data Deletion',
      content: 'You have the right to delete your account and all associated data at any time. Simply contact us at krohit41122@gmail.com and we will permanently delete all your data within 7 business days.'
    },
  ];

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#030712', color: '#fff', minHeight: '100vh' }}>

      {/* Nav */}
      <nav className="privacy-nav">
        <div className="privacy-nav-logo" onClick={() => navigate('/')}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #22d3ee, #0891b2)',
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18, flexShrink: 0
          }}>📈</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20 }}>
            TradeEmpire 👑
          </span>
        </div>

        <div className="privacy-nav-buttons">
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 20px', borderRadius: 10,
              background: 'transparent', border: '1px solid rgba(148,163,184,0.3)',
              color: '#fff', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
              fontSize: 14, whiteSpace: 'nowrap'
            }}>
            Login
          </button>
          <button
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

      {/* Main Content */}
      <div className="privacy-content">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <span style={{ fontSize: 12, color: '#22d3ee', fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase' }}>
            Legal
          </span>
          <h1 className="privacy-h1">
            Privacy{' '}
            <span style={{
              background: 'linear-gradient(90deg, #22d3ee, #818cf8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              Policy 🔒
            </span>
          </h1>
          <p className="privacy-header-sub" style={{ color: '#64748b', marginTop: 16, fontSize: 16, lineHeight: 1.7, maxWidth: 600, margin: '16px auto 0' }}>
            At TradeEmpire, your privacy is not an afterthought — it's a core principle. Here's exactly what we do and don't do with your data.
          </p>
          <p style={{ color: '#475569', marginTop: 12, fontSize: 13 }}>
            Last updated: March 2026 · Effective immediately
          </p>
        </div>

        {/* Trust Banner */}
        <div className="trust-banner">
          <span className="trust-banner-emoji" style={{ fontSize: 40 }}>🛡️</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18, fontWeight: 700, color: '#22d3ee', marginBottom: 6
            }}>
              Our Privacy Promise
            </h3>
            <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7 }}>
              We built TradeEmpire as traders ourselves. We know how sensitive financial data is.
              We promise:{' '}
              <strong style={{ color: '#fff' }}>no selling, no sharing, no spamming — ever.</strong>
            </p>
          </div>
        </div>

        {/* Policy Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {policies.map((p, i) => (
            <div
              key={i}
              className="policy-card"
              style={{
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 18,
                padding: '22px 26px',
              }}
            >
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span className="policy-card-icon" style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{p.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 16, fontWeight: 700, marginBottom: 8
                  }}>
                    {p.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.8 }}>{p.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Box */}
        <div
          className="privacy-contact-box"
          style={{
            marginTop: 48,
            background: 'rgba(15,23,42,0.6)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20,
            padding: '32px',
            textAlign: 'center'
          }}
        >
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 22, fontWeight: 700, marginBottom: 10
          }}>
            Questions about Privacy?
          </h3>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
            Reach out directly to Rohit — the founder reads every email personally.
          </p>
          <a
            href="mailto:krohit41122@gmail.com"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 10,
              background: 'rgba(34,211,238,0.08)',
              border: '1px solid rgba(34,211,238,0.2)',
              color: '#22d3ee', fontSize: 14,
              textDecoration: 'none', fontWeight: 500,
              wordBreak: 'break-word'
            }}
          >
            📧 krohit41122@gmail.com
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="privacy-footer">
        <p style={{ color: '#475569', fontSize: 13 }}>
          © 2026 TradeEmpire 👑 || Built by Rohit Dhakad
        </p>
      </footer>
    </div>
  );
}