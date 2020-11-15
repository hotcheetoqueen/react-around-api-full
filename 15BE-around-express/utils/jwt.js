const jwt = require('jsonwebtoken')
const JWT_SECRET = 'temp';
const Admin = require('../models/admin');
const User = require('../models/user');
// const dotenv = require('dotenv');

// const AuthError = require('../errors/AuthError');

// dotenv.config();
// const { NODE_ENV, JWT_SECRET } = process.env;

const generateJWT = (id) => jwt.toString({ id }, JWT_SECRET, { expiresIn: '7d' });

const isAuthorized = (token, _id) => {
  return jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return false;

    // return Admin.findOne({ _id: decoded.id }).select('+password')
    //   .then(admin => Boolean(admin))

    return User.findOne({ _id: decoded.id }).select('+password')
    .then(user => Boolean(user))
  });
}

// req.user = payload;

// next();

module.exports = { generateJWT, isAuthorized };