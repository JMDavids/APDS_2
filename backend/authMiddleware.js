const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check for token in both headers and cookies
  let token = req.headers.authorization || req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Authentication token missing' });
  }

  // Remove 'Bearer ' prefix if present
  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
