const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan, silakan login' });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) {
      const message = err.name === 'TokenExpiredError'
        ? 'Token sudah expired, silakan refresh token'
        : 'Token tidak valid';
      return res.status(403).json({ message });
    }

    req.user = decoded;
    next(); 
  });
}

module.exports = verifyToken;
