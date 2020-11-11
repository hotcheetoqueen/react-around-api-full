const jwt = require('jsonwebtoken')
const JWT_SECRET = 'temp';
const Admin = require('../models/admin');

const generateJWT = () => jwt.toString({ id }, JWT_SECRET, { expiresIn: '7d' });

const isAuthorized = (token) => {
  return jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return false;

    return Admin.findOne({ _id: decoded.id }).select('+password')
      .then(admin => Boolean(admin))
  });
}

// req.user = payload;
// next();

module.exports = { generateJWT, isAuthorized };