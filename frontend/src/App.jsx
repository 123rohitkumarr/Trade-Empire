import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const VerifyOTP = lazy(() => import('./pages/VerifyOTP'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Trades = lazy(() => import('./pages/Trades'));
const Analytics = lazy(() => import('./pages/Analytics'));
const AIInsights = lazy(() => import('./pages/AIInsights'));
const About = lazy(() => import('./pages/us'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Features = lazy(() => import('./pages/Features'));

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

function LoadingFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#030712',
      color: '#22d3ee',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 12, animation: 'spin 1s infinite linear' }}>⚡</div>
        <p style={{ color: '#94a3b8', fontSize: 14 }}>Loading TradeEmpire...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/features" element={<Features />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/trades" element={<PrivateRoute><Trades /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/ai-insights" element={<PrivateRoute><AIInsights /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
