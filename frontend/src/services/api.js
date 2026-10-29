import axios from 'axios';

// Get base URL from environment or default to localhost:5000 in dev
const envUrl = import.meta.env.VITE_API_URL;
const defaultUrl = 'http://localhost:5000/api';
const baseURL = (envUrl || defaultUrl).trim().replace(/\/+$/, '');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Attach Authorization header automatically
api.interceptors.request.use(
  (config) => {
    const rawToken = localStorage.getItem('token');
    if (rawToken) {
      const token = rawToken.startsWith('Bearer ') ? rawToken : `Bearer ${rawToken}`;
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 Unauthorized (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('name');

      const publicPaths = ['/', '/login', '/register', '/verify-otp', '/about', '/contact', '/privacy', '/features'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

