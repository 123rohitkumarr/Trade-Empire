import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setError('Please fill name, email and message!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(' https://trade-empire-sgji.onrender.com/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
      } else {
        setError(data.message || 'Something went wrong!');
      }
    } catch (err) {
      setError('Server error! Please try again.');
    }
    setLoading(false);
  };

  const contacts = [
    { icon: '📧', title: 'Email', value: 'krohit41122@gmail.com', sub: 'Reply within 24 hours', href: 'mailto:krohit41122@gmail.com' },
    { icon: '📱', title: 'Phone / WhatsApp', value: '+91 6261551154', sub: 'Mon–Sat, 9am–6pm IST', href: 'tel:+916261551154' },
    { icon: '📸', title: 'Instagram', value: '@r_d_rohit_dhakad', sub: 'DM for quick replies', href: 'https://instagram.com/r_d_rohit_dhakad' },
    { icon: '📍', title: 'Location', value: 'Jaipur, Rajasthan', sub: 'India 302001', href: null },
  ];

  return (
    <div className="page">

      {/* BG */}
      <div className="bg-grid"></div>
      <div className="glow g1"></div>
      <div className="glow g2"></div>
      <div className="glow g3"></div>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => navigate('/')}>
          <div className="logo-box">📈</div>
          <span className="logo-name">Trade<span className="logo-emp">Empire</span> 👑</span>
        </div>
        <div className="nav-btns">
          <button className="nav-login" onClick={() => navigate('/login')}>Login</button>
          <button className="nav-register" onClick={() => navigate('/register')}>Start Free →</button>
        </div>
      </nav>

      <div className={`content ${loaded ? 'show' : ''}`}>

        {/* HERO */}
        <div className="hero">
          <span className="hero-tag">✉️ Get In Touch</span>
          <h1 className="hero-title">
            Let's talk <span className="gradient-text">trading! 👑</span>
          </h1>
          <p className="hero-sub">Questions, feedback, or just want to connect? Rohit is here!</p>
        </div>

        <div className="grid">

          {/* LEFT — INFO */}
          <div className="left">

            {/* PROFILE CARD */}
            <div className="profile-card">
              <div className="profile-avatar">RD</div>
              <div className="profile-info">
                <p className="profile-name">Rohit Dhakad</p>
                <p className="profile-role">Founder · TradeEmpire 👑</p>
                <p className="profile-loc">📍 Jaipur, Rajasthan 🇮🇳</p>
              </div>
              <div className="profile-badge">Active ✅</div>
            </div>

            {/* CONTACT CARDS */}
            <div className="contact-list">
              {contacts.map((c, i) => (
                <div
                  key={i}
                  className={`contact-item ${c.href ? 'clickable' : ''}`}
                  onClick={() => c.href && window.open(c.href, '_blank')}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="ci-icon">{c.icon}</div>
                  <div className="ci-info">
                    <p className="ci-title">{c.title}</p>
                    <p className="ci-value">{c.value}</p>
                    <p className="ci-sub">{c.sub}</p>
                  </div>
                  {c.href && <span className="ci-arrow">→</span>}
                </div>
              ))}
            </div>

            {/* QUOTE */}
            <div className="quote-card">
              <p className="quote-text">"The stock market is filled with individuals who know the price of everything, but the value of nothing."</p>
              <p className="quote-author">— Philip Fisher</p>
            </div>

          </div>

          {/* RIGHT — FORM */}
          <div className="right">
            {sent ? (
              <div className="success-box">
                <div className="success-icon">🎉</div>
                <h3 className="success-title">Message Sent!</h3>
                <p className="success-sub">Rohit will get back to you within 24 hours.</p>
                <p className="success-email">✅ Delivered to krohit41122@gmail.com</p>
                <button className="send-another" onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="form-top">
                  <h2 className="form-title">Send a Message 📨</h2>
                  <p className="form-sub">Fill the form below and I'll get back to you ASAP!</p>
                </div>

                <div className="form-body">
                  <div className="row-2">
                    <div className="field">
                      <label>Your Name</label>
                      <input
                        placeholder="Rohit Dhakad"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="field">
                      <label>Email Address</label>
                      <input
                        placeholder="you@gmail.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label>Subject</label>
                    <input
                      placeholder="What's this about?"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                    />
                  </div>

                  <div className="field">
                    <label>Message</label>
                    <textarea
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      rows={5}
                    />
                  </div>

                  {error && <div className="error-box">⚠️ {error}</div>}

                  <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? <><span className="spinner"></span> Sending...</> : 'Send Message →'}
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 TradeEmpire👑 || Built by Rohit Dhakad ✨</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .page {
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
          filter: blur(130px); opacity: 0.18; z-index: 0;
          animation: floatGlow 12s infinite alternate;
        }

        .g1 { width: 500px; height: 500px; background: #6366f1; top: -150px; left: -100px; }
        .g2 { width: 400px; height: 400px; background: #22d3ee; bottom: -100px; right: -100px; animation-delay: 4s; }
        .g3 { width: 300px; height: 300px; background: #ec4899; top: 50%; left: 40%; animation-delay: 7s; }

        @keyframes floatGlow {
          from { transform: translate(0,0); }
          to { transform: translate(50px,-50px); }
        }

        /* ── NAV ── */
        .nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 18px 60px;
          background: rgba(2,6,23,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          gap: 16px;
        }

        .nav-logo {
          display: flex; align-items: center; gap: 12px;
          cursor: pointer; flex-shrink: 0;
        }

        .logo-box {
          width: 38px; height: 38px; flex-shrink: 0;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }

        .logo-name { font-size: 20px; font-weight: 800; color: white; }
        .logo-emp {
          background: linear-gradient(90deg, #6366f1, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-btns { display: flex; gap: 10px; flex-shrink: 0; }

        .nav-login {
          padding: 10px 20px; border-radius: 10px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8; cursor: pointer;
          font-family: 'Poppins', sans-serif;
          font-size: 14px; transition: 0.3s;
          white-space: nowrap;
        }

        .nav-login:hover { border-color: #6366f1; color: white; }

        .nav-register {
          padding: 10px 22px; border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; color: white;
          font-weight: 700; font-size: 14px;
          font-family: 'Poppins', sans-serif;
          cursor: pointer; transition: 0.3s;
          white-space: nowrap;
        }

        .nav-register:hover {
          transform: scale(1.04);
          box-shadow: 0 0 20px rgba(99,102,241,0.5);
        }

        /* ── CONTENT ── */
        .content {
          position: relative; z-index: 1;
          max-width: 1200px; margin: auto;
          padding: 70px 40px 100px;
          opacity: 0; transform: translateY(30px);
          transition: all 0.8s ease;
        }

        .content.show { opacity: 1; transform: translateY(0); }

        /* ── HERO ── */
        .hero {
          text-align: center;
          margin-bottom: 70px;
        }

        .hero-tag {
          display: inline-block;
          padding: 6px 18px; border-radius: 20px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          color: #818cf8; font-size: 13px; font-weight: 600;
          letter-spacing: 1px; margin-bottom: 20px;
        }

        .hero-title {
          font-size: 52px; font-weight: 800;
          letter-spacing: -1.5px; margin-bottom: 16px;
          line-height: 1.1;
        }

        .gradient-text {
          background: linear-gradient(90deg, #22d3ee, #818cf8, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-sub { color: #64748b; font-size: 16px; }

        /* ── GRID ── */
        .grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 40px; align-items: start;
        }

        /* ── LEFT ── */
        .left { display: flex; flex-direction: column; gap: 20px; }

        /* PROFILE */
        .profile-card {
          display: flex; align-items: center; gap: 16px;
          padding: 22px 24px;
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 20px;
          transition: 0.3s;
        }

        .profile-card:hover {
          border-color: rgba(99,102,241,0.4);
          box-shadow: 0 20px 50px rgba(99,102,241,0.15);
        }

        .profile-avatar {
          width: 56px; height: 56px; flex-shrink: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 18px; color: white;
        }

        .profile-info { flex: 1; min-width: 0; }
        .profile-name { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
        .profile-role { color: #818cf8; font-size: 13px; margin-bottom: 3px; }
        .profile-loc { color: #475569; font-size: 12px; }

        .profile-badge {
          padding: 5px 12px; border-radius: 20px;
          background: rgba(34,197,94,0.12);
          border: 1px solid rgba(34,197,94,0.3);
          color: #22c55e; font-size: 12px; font-weight: 600;
          flex-shrink: 0;
        }

        /* CONTACT LIST */
        .contact-list { display: flex; flex-direction: column; gap: 12px; }

        .contact-item {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 20px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; transition: 0.3s;
          animation: fadeUp 0.5s ease forwards;
          opacity: 0;
        }

        .content.show .contact-item { opacity: 1; }
        .contact-item.clickable { cursor: pointer; }

        .contact-item:hover {
          border-color: rgba(34,211,238,0.3);
          background: rgba(34,211,238,0.04);
          transform: translateX(6px);
        }

        .ci-icon { font-size: 24px; flex-shrink: 0; }
        .ci-info { flex: 1; min-width: 0; }
        .ci-title { color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
        .ci-value { color: #22d3ee; font-size: 14px; font-weight: 600; margin-bottom: 2px; word-break: break-all; }
        .ci-sub { color: #475569; font-size: 12px; }
        .ci-arrow { color: #475569; font-size: 18px; flex-shrink: 0; transition: 0.3s; }
        .contact-item:hover .ci-arrow { color: #22d3ee; transform: translateX(4px); }

        /* QUOTE */
        .quote-card {
          padding: 24px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-left: 3px solid #6366f1;
          border-radius: 16px;
        }

        .quote-text { color: #94a3b8; font-size: 13px; line-height: 1.8; font-style: italic; margin-bottom: 10px; }
        .quote-author { color: #6366f1; font-size: 12px; font-weight: 600; }

        /* ── RIGHT — FORM ── */
        .right {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; padding: 40px;
          backdrop-filter: blur(10px);
          transition: 0.3s;
        }

        .right:hover {
          border-color: rgba(99,102,241,0.2);
          box-shadow: 0 30px 80px rgba(99,102,241,0.1);
        }

        .form-top { margin-bottom: 30px; }
        .form-title { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
        .form-sub { color: #64748b; font-size: 14px; }

        .form-body { display: flex; flex-direction: column; gap: 20px; }

        .row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .field { display: flex; flex-direction: column; gap: 8px; }

        .field label {
          font-size: 12px; font-weight: 600;
          color: #64748b; text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .field input, .field textarea {
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: white; font-size: 14px;
          font-family: 'Poppins', sans-serif;
          outline: none; transition: 0.3s;
          resize: vertical;
          width: 100%;
        }

        .field input::placeholder, .field textarea::placeholder { color: #475569; }

        .field input:focus, .field textarea:focus {
          border-color: #6366f1;
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 20px rgba(99,102,241,0.2);
        }

        .error-box {
          padding: 12px 16px; border-radius: 10px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171; font-size: 13px;
        }

        .submit-btn {
          padding: 16px; border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; font-weight: 700;
          font-size: 16px; font-family: 'Poppins', sans-serif;
          cursor: pointer; transition: 0.3s;
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
          width: 100%;
        }

        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 50px rgba(99,102,241,0.4);
        }

        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* SUCCESS */
        .success-box {
          text-align: center; padding: 50px 20px;
          display: flex; flex-direction: column;
          align-items: center; gap: 14px;
        }

        .success-icon { font-size: 64px; animation: bounce 1s ease infinite alternate; }

        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-12px); }
        }

        .success-title { font-size: 26px; font-weight: 800; }
        .success-sub { color: #64748b; font-size: 14px; }
        .success-email { color: #22c55e; font-size: 13px; }

        .send-another {
          margin-top: 10px; padding: 12px 28px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none; color: white;
          font-weight: 700; font-size: 14px;
          font-family: 'Poppins', sans-serif;
          cursor: pointer; transition: 0.3s;
        }

        .send-another:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(99,102,241,0.4); }

        /* ── FOOTER ── */
        .footer {
          position: relative; z-index: 1;
          padding: 30px 60px;
          border-top: 1px solid rgba(255,255,255,0.05);
          text-align: center;
        }

        .footer p { color: #334155; font-size: 13px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ══════════════════════════════
           RESPONSIVE BREAKPOINTS
        ══════════════════════════════ */

        /* Tablet (≤ 900px) */
        @media (max-width: 900px) {
          .nav { padding: 16px 24px; }
          .grid { grid-template-columns: 1fr; gap: 28px; }
          .hero-title { font-size: 38px; letter-spacing: -1px; }
          .content { padding: 48px 24px 80px; }
          .row-2 { grid-template-columns: 1fr; }
          .right { padding: 28px; }
          .footer { padding: 24px 24px; }
        }

        /* Mobile (≤ 480px) */
        @media (max-width: 480px) {
          .nav { padding: 12px 16px; }
          .nav-login { padding: 8px 14px; font-size: 13px; }
          .nav-register { padding: 8px 14px; font-size: 13px; }
          .logo-name { font-size: 17px; }

          .content { padding: 36px 16px 60px; }
          .hero { margin-bottom: 44px; }
          .hero-title { font-size: 28px; letter-spacing: -0.5px; }
          .hero-sub { font-size: 13px; }

          .profile-card { padding: 16px; gap: 12px; }
          .profile-badge { display: none; }

          .contact-item { padding: 14px 14px; gap: 10px; }
          .ci-icon { font-size: 20px; }
          .ci-value { font-size: 13px; }

          .right { padding: 20px 16px; border-radius: 18px; }
          .form-title { font-size: 20px; }
          .submit-btn { font-size: 14px; padding: 14px; }

          .footer { padding: 20px 16px; }
        }

        /* Very small (≤ 360px) */
        @media (max-width: 360px) {
          .hero-title { font-size: 23px; }
          .logo-name { display: none; }
          .nav-login { display: none; }
        }
      `}</style>
    </div>
  );
}