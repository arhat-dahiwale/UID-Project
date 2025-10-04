const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ error: 'Access denied. No token.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // attach payload (id, role) to req
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

function authenticateAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }
    req.admin = decoded; // store admin payload
    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
}

module.exports = { authMiddleware, authenticateAdmin };
