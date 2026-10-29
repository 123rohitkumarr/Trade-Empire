import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleVerify = async () => {
    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP!');
      return;
    }
    setLoading(true);
    setError('');
    setInfo('');
    try {
      await api.post('/auth/verify-otp', { email: email.trim(), otp: otp.trim() });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP!');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    if (!email) {
      setError('Please provide your email address first.');
      return;
    }
    setResending(true);
    setError('');
    setInfo('');
    try {
      const res = await api.post('/auth/resend-otp', { email: email.trim() });
      setInfo(res.data?.message || 'New OTP sent to your email!');
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
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
              <p className="subtitle">Verification code sent to</p>
              {location.state?.email ? (
                <p className="email-text">{email}</p>
              ) : (
                <input
                  className="email-inp"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid rgba(99,102,241,0.3)',
                    background: 'rgba(15,23,42,0.8)',
                    color: '#fff',
                    marginTop: 8,
                    marginBottom: 12
                  }}
                />
              )}
              <p className="subtitle" style={{ marginTop: 6 }}>Check your inbox & spam folder ✅</p>
            </div>

            {error && <p className="error">⚠️ {error}</p>}
            {info && <p className="info-msg" style={{ color: '#22c55e', fontSize: 13, marginTop: 8, textAlign: 'center' }}>✅ {info}</p>}

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

            <div className="resend-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <span className="timer-text" style={{ fontSize: 12, color: '#94a3b8' }}>⏰ Code expires in 10 mins</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || resending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: countdown > 0 ? '#64748b' : '#22d3ee',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                  padding: 4
                }}
              >
                {resending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </button>
            </div>

            <p className="link" onClick={() => navigate('/register')}>
              ← Back to Register
            </p>
          </>
        )}
      </div>

      <div className="footer">© 2026 TradeEmpire 👑 · Built with excellence</div>

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
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
        }
        .g1 { width: 400px; height: 400px; background: rgba(99,102,241,0.15); top: -100px; left: -100px; }
        .g2 { width: 350px; height: 350px; background: rgba(168,85,247,0.12); bottom: -100px; right: -100px; }

        .logo {
          position: absolute;
          top: 28px; left: 36px;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 10;
        }
        .logo-text {
          background: linear-gradient(135deg, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .card {
          width: 100%;
          max-width: 440px;
          background: rgba(15,23,42,0.85);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          position: relative;
          z-index: 1;
        }

        .heading { font-size: 26px; font-weight: 700; margin-bottom: 8px; }
        .text {
          background: linear-gradient(135deg, #fff, #cbd5e1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle { color: #64748b; font-size: 14px; }
        .email-text { color: #22d3ee; font-weight: 600; font-size: 15px; margin-top: 4px; }

        .error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 13px;
          margin-top: 16px;
          text-align: center;
        }

        .field { margin-top: 24px; }
        .label { display: block; font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }

        .otp-inp {
          width: 100%;
          padding: 16px;
          background: rgba(30,41,59,0.8);
          border: 2px solid rgba(99,102,241,0.3);
          border-radius: 14px;
          color: #22d3ee;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 12px;
          text-align: center;
          outline: none;
          transition: all 0.2s;
        }
        .otp-inp:focus {
          border-color: #6366f1;
          box-shadow: 0 0 20px rgba(99,102,241,0.25);
        }

        .btn {
          width: 100%;
          padding: 14px;
          margin-top: 20px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 15px rgba(99,102,241,0.3);
        }
        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.4);
        }
        .btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .link {
          text-align: center;
          margin-top: 20px;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .link:hover { color: #94a3b8; }

        .success-box { text-align: center; padding: 20px 0; }
        .success-title { font-size: 24px; font-weight: 700; color: #22c55e; margin: 16px 0 8px; }
        .success-sub { color: #64748b; font-size: 14px; }

        .footer {
          position: absolute;
          bottom: 20px;
          color: #334155;
          font-size: 12px;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
