const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../server');

// Lightweight in-memory request runner for Express apps (zero TCP socket / no EACCES)
function executeRequest(app, { method = 'GET', url = '/', headers = {}, body = null }) {
  return new Promise((resolve) => {
    const req = new http.IncomingMessage();
    req.method = method;
    req.url = url;
    req.headers = Object.fromEntries(
      Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
    );

    let resHeaders = {};
    let statusCode = 200;
    let resData = '';

    const res = new http.ServerResponse(req);
    res.setHeader = (name, value) => {
      resHeaders[name.toLowerCase()] = value;
      return res;
    };
    res.getHeader = (name) => resHeaders[name.toLowerCase()];
    res.writeHead = (code, headersObj = {}) => {
      statusCode = code;
      Object.entries(headersObj).forEach(([k, v]) => {
        resHeaders[k.toLowerCase()] = v;
      });
      return res;
    };
    res.status = (code) => {
      statusCode = code;
      return res;
    };
    res.write = (chunk) => {
      if (chunk) resData += chunk.toString();
      return true;
    };
    res.end = (chunk) => {
      if (chunk) resData += chunk.toString();
      let json = null;
      try {
        json = JSON.parse(resData);
      } catch {
        json = resData;
      }
      resolve({
        status: statusCode,
        headers: resHeaders,
        body: json
      });
    };

    // Feed body stream if provided
    if (body) {
      const payload = typeof body === 'object' ? JSON.stringify(body) : String(body);
      req.headers['content-type'] = req.headers['content-type'] || 'application/json';
      req.headers['content-length'] = Buffer.byteLength(payload);
      process.nextTick(() => {
        req.push(payload);
        req.push(null);
      });
    } else {
      process.nextTick(() => {
        req.push(null);
      });
    }

    app(req, res);
  });
}

describe('Server Routes In-Memory Integration', () => {
  test('GET /health returns 200 with status ok and uptime', async () => {
    const res = await executeRequest(app, { method: 'GET', url: '/health' });
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.ok(res.body.uptime !== undefined);
  });

  test('GET / returns API info', async () => {
    const res = await executeRequest(app, { method: 'GET', url: '/' });
    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Trade Empire API');
    assert.equal(res.body.status, 'online');
  });

  test('GET /api/trades without token returns 401 Unauthorized', async () => {
    const res = await executeRequest(app, { method: 'GET', url: '/api/trades' });
    assert.equal(res.status, 401);
    assert.ok(res.body.message.includes('Access denied'));
  });

  test('Unknown route returns 404', async () => {
    const res = await executeRequest(app, { method: 'GET', url: '/api/unknown-endpoint' });
    assert.equal(res.status, 404);
    assert.ok(res.body.message.includes('Route not found'));
  });
});
