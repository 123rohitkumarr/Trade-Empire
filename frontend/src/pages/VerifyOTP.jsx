import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(' https://trade-empire-sgji.onrender.com/api/auth/verify-otp', { email, otp });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP!');
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
        {success ? (
          <div className="success-box">
            <div style={{ fontSize: 64 }}>🎉</div>
            <h3 className="success-title">Email Verified!</h3>
            <p className="success-sub">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
              <h2 className="heading">
                <span className="text">Verify Your Email</span>
              </h2>
              <p className="subtitle">OTP sent to</p>
              <p className="email-text">{email}</p>
              <p className="subtitle" style={{ marginTop: 6 }}>Check your inbox & spam folder ✅</p>
            </div>

            {error && <p className="error">⚠️ {error}</p>}

            <div className="field">
              <label className="label">Enter 6-digit OTP</label>
              <input
                className="otp-inp"
                placeholder="• • • • • •"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            <button className="btn" onClick={handleVerify} disabled={loading}>
              {loading ? '⏳ Verifying...' : 'Verify OTP ✅'}
            </button>

            <div className="timer-box">
              <p className="timer-text">⏰ OTP expires in 10 minutes</p>
            </div>

            <p className="link" onClick={() => navigate('/register')}>
              ← Back to Register
            </p>
          </>
        )}
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
        .g2 { width: 300px; height: 300px; background: #22d3ee; bottom: -50px; right: -50px; }

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

        .logo-text { font-weight: 800; color: white; font-size: 16px; }

        .card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 420px;
          padding: 40px 32px;
          border-radius: 20px;
          background: rgba(15,23,42,0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 0 60px rgba(99,102,241,0.15);
          display: flex;
          flex-direction: column;
          gap: 20px;
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
          margin-bottom: 6px;
        }

        .text {
          background: linear-gradient(90deg, #6366f1, #22d3ee);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle { color: #64748b; font-size: 13px; }

        .email-text {
          color: #22d3ee;
          font-weight: 700;
          font-size: 14px;
          margin-top: 4px;
          word-break: break-all;
        }

        .field { display: flex; flex-direction: column; gap: 8px; }

        .label { font-size: 13px; color: #94a3b8; font-weight: 500; }

        .otp-inp {
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          color: white;
          font-size: 28px;
          letter-spacing: 16px;
          text-align: center;
          font-family: 'Poppins', sans-serif;
          outline: none;
          transition: 0.3s;
          width: 100%;
        }

        .otp-inp:focus {
          border-color: #6366f1;
          box-shadow: 0 0 20px rgba(99,102,241,0.25);
          background: rgba(99,102,241,0.06);
        }

        .btn {
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          color: white;
          cursor: pointer;
          font-weight: 700;
          font-size: 15px;
          font-family: 'Poppins', sans-serif;
          transition: 0.3s;
        }

        .btn:hover { transform: scale(1.02); box-shadow: 0 0 25px rgba(99,102,241,0.4); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .timer-box {
          background: rgba(34,211,238,0.05);
          border: 1px solid rgba(34,211,238,0.15);
          border-radius: 10px;
          padding: 10px;
          text-align: center;
        }

        .timer-text { color: #22d3ee; font-size: 13px; }

        .link {
          text-align: center;
          color: #64748b;
          cursor: pointer;
          font-size: 13px;
        }

        .error {
          color: #f87171;
          font-size: 13px;
          padding: 10px 14px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 8px;
          text-align: center;
        }

        .success-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 20px 0;
          text-align: center;
        }

        .success-title {
          font-size: 24px;
          font-weight: 800;
          color: #22c55e;
        }

        .success-sub { color: #64748b; font-size: 14px; }

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
          .otp-inp { font-size: 22px; letter-spacing: 10px; }
          .logo-text { font-size: 14px; }
        }
      `}</style>
    </div>
  );
}