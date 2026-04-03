import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(' https://trade-empire-sgji.onrender.com/api/auth/register', form);
      navigate('/verify-otp', { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="bg"></div>
      <div className="glow g1"></div>
      <div className="glow g2"></div>

      {/* Logo */}
      <div className="logo" onClick={() => navigate('/')}>
        📈 <span className="logo-text">TradeEmpire 👑</span>
      </div>

      <div className="card">
        <div style={{ textAlign: 'center' }}>
          <h2 className="heading">
            <span className="text">Create Your Empire</span>{' '}
            <span className="emoji">👑</span>
          </h2>
          <p className="subtext">Join 10,000+ traders on TradeEmpire</p>
        </div>

        {error && <p className="error">⚠️ {error}</p>}

        <div className="field">
          <label className="label">Full Name</label>
          <input className="inp" placeholder="Rohit Dhakad"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} />
        </div>

        <div className="field">
          <label className="label">Email</label>
          <input className="inp" placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} />
        </div>

        <div className="field">
          <label className="label">Password</label>
          <input className="inp" type="password" placeholder="Create a strong password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} />
        </div>

        <button className="btn" onClick={handleSubmit} disabled={loading}>
          {loading ? '📤 Sending OTP...' : 'Start Trading →'}
        </button>

        <p className="terms">
          By registering, you agree to our{' '}
          <span className="link-highlight" onClick={() => navigate('/privacy')}>Privacy Policy</span>
        </p>

        <p className="link" onClick={() => navigate('/login')}>
          Already have an account? <span className="link-highlight">Login here</span>
        </p>

        <p className="link" onClick={() => navigate('/')}>
          ← Back to Home
        </p>
      </div>

      <div className="footer">© 2026 TradeEmpire 👑 · Built by Rohit Dhakad</div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #020617;
          overflow: hidden;
          position: relative;
          font-family: 'Poppins', sans-serif;
          padding: 20px;
        }

        .bg {
          position: fixed;
          width: 200%; height: 200%;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: moveGrid 12s linear infinite;
          z-index: 0;
        }

        @keyframes moveGrid {
          from { transform: translate(0,0); }
          to { transform: translate(-40px,-40px); }
        }

        .glow {
          position: fixed;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.12;
          z-index: 0;
        }

        .g1 { width: 400px; height: 400px; background: #6366f1; top: -100px; left: -100px; }
        .g2 { width: 300px; height: 300px; background: #ec4899; bottom: -50px; right: -50px; }

        .logo {
          position: fixed;
          top: 20px;
          left: 24px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 16px;
        }

        .logo-text {
          font-weight: 800;
          color: white;
          font-size: 16px;
        }

        .card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 420px;
          padding: 36px 32px;
          border-radius: 20px;
          background: rgba(15,23,42,0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 0 60px rgba(99,102,241,0.15);
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fadeIn 0.7s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .heading {
          font-size: 24px;
          font-weight: 700;
          color: white;
          margin-bottom: 4px;
        }

        .text {
          background: linear-gradient(90deg, #6366f1, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .emoji { -webkit-text-fill-color: initial; }

        .subtext {
          color: #64748b;
          font-size: 13px;
          margin-top: 4px;
        }

        .field { display: flex; flex-direction: column; gap: 6px; }

        .label { font-size: 13px; color: #94a3b8; font-weight: 500; }

        .inp {
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: white;
          font-size: 14px;
          font-family: 'Poppins', sans-serif;
          outline: none;
          transition: 0.3s;
          width: 100%;
        }

        .inp:focus {
          border-color: #6366f1;
          box-shadow: 0 0 15px rgba(99,102,241,0.2);
          background: rgba(99,102,241,0.06);
        }

        .btn {
          padding: 13px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #ec4899);
          color: white;
          cursor: pointer;
          font-weight: 700;
          font-size: 15px;
          font-family: 'Poppins', sans-serif;
          transition: 0.3s;
          margin-top: 4px;
        }

        .btn:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(99,102,241,0.4); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .link {
          text-align: center;
          color: #64748b;
          cursor: pointer;
          font-size: 13px;
        }

        .terms {
          text-align: center;
          color: #475569;
          font-size: 12px;
        }

        .link-highlight { color: #818cf8; font-weight: 600; cursor: pointer; }

        .error {
          color: #f87171;
          font-size: 13px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          text-align: center;
        }

        .footer {
          position: fixed;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255,255,255,0.25);
          font-size: 11px;
          z-index: 10;
          white-space: nowrap;
        }

        @media (max-width: 480px) {
          .card { padding: 28px 20px; }
          .heading { font-size: 20px; }
          .logo-text { font-size: 14px; }
        }
      `}</style>
    </div>
  );
}