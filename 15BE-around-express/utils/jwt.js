const jwt = require('jsonwebtoken')
const JWT_SECRET = 'secret';
// const Admin = require('../models/admin');
const User = require('../models/user');

const generateJWT = (_id) => jwt.toString({ _id }, JWT_SECRET, { expiresIn: '7d' });

const isAuthorized = (token, _id) => {
  return jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return false;

    return User.findOne({ _id: decoded.id }).select('+password')
    .then(user => Boolean(user))
  });
}

module.exports = { generateJWT, isAuthorized };