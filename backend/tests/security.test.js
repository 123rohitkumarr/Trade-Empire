const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth');
const { securityHeaders, createRateLimiter } = require('../middleware/security');

describe('Security Headers Middleware', () => {
  test('Sets all essential security headers', () => {
    const headers = {};
    const req = {};
    const res = {
      setHeader: (key, val) => { headers[key] = val; }
    };
    let nextCalled = false;

    securityHeaders(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.equal(headers['X-Content-Type-Options'], 'nosniff');
    assert.equal(headers['X-Frame-Options'], 'DENY');
    assert.equal(headers['X-XSS-Protection'], '1; mode=block');
    assert.equal(headers['Referrer-Policy'], 'strict-origin-when-cross-origin');
    assert.ok(headers['Strict-Transport-Security']);
  });
});

describe('Authentication Middleware', () => {
  const secret = 'test_jwt_secret_key_12345';
  process.env.JWT_SECRET = secret;

  test('Blocks request when Authorization header is missing', () => {
    const req = { header: () => null };
    let statusSent = null;
    let jsonSent = null;
    const res = {
      status: (code) => {
        statusSent = code;
        return { json: (data) => { jsonSent = data; } };
      }
    };

    authMiddleware(req, res, () => {});

    assert.equal(statusSent, 401);
    assert.ok(jsonSent.message.includes('Access denied'));
  });

  test('Blocks request when token is invalid', () => {
    const req = { header: () => 'Bearer invalid_garbage_token' };
    let statusSent = null;
    const res = {
      status: (code) => {
        statusSent = code;
        return { json: () => {} };
      }
    };

    authMiddleware(req, res, () => {});

    assert.equal(statusSent, 401);
  });

  test('Attaches decoded user payload when valid token provided', () => {
    const payload = { _id: 'user_12345', email: 'trader@example.com' };
    const token = jwt.sign(payload, secret);
    const req = { header: () => `Bearer ${token}` };
    let nextCalled = false;
    const res = {};

    authMiddleware(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.equal(req.user._id, 'user_12345');
    assert.equal(req.user.email, 'trader@example.com');
  });
});

describe('Rate Limiter Middleware', () => {
  test('Allows requests under limit and blocks requests exceeding limit', () => {
    const limiter = createRateLimiter({ windowMs: 1000, max: 2, message: 'Rate exceeded' });
    const req = { ip: '127.0.0.1', headers: { 'x-test-rate-limit': 'true' } };

    let codeSent = null;
    const res = {
      setHeader: () => {},
      status: (c) => {
        codeSent = c;
        return { json: () => {} };
      }
    };

    let passCount = 0;
    const next = () => { passCount += 1; };

    // Request 1: Allowed
    limiter(req, res, next);
    assert.equal(passCount, 1);

    // Request 2: Allowed
    limiter(req, res, next);
    assert.equal(passCount, 2);

    // Request 3: Exceeds limit -> 429
    limiter(req, res, next);
    assert.equal(codeSent, 429);
  });
});

