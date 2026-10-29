const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Access denied! No authorization token provided.' });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    if (!token) {
      return res.status(401).json({ message: 'Access denied! Empty token provided.' });
    }

    const secret = process.env.JWT_SECRET || 'fallback_development_secret_do_not_use_in_prod';
    const verified = jwt.verify(token, secret);
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired! Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid token! Authorization failed.' });
  }
};

module.exports = auth;
