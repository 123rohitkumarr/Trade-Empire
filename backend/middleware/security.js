/**
 * Security and Rate Limiting Middleware
 * Lightweight, zero-dependency implementations for headers and rate limiting.
 */

// Basic security headers
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

// Configurable in-memory rate limiter per IP address
const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests. Please try again later.'
} = {}) => {
  const requests = new Map();

  // Periodic cleanup of expired records every windowMs
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, data] of requests.entries()) {
      if (now > data.resetTime) {
        requests.delete(key);
      }
    }
  }, windowMs);

  if (interval.unref) interval.unref();

  return (req, res, next) => {
    // In test environment, allow bypassing rate limits if desired
    if (process.env.NODE_ENV === 'test' && !req.headers['x-test-rate-limit']) {
      return next();
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = requests.get(ip);

    if (!entry || now > entry.resetTime) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= max) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({ message });
    }

    entry.count += 1;
    next();
  };
};

module.exports = {
  securityHeaders,
  createRateLimiter
};

