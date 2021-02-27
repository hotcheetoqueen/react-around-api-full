const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secret';
const AuthError = require('../errors/AuthError');

// dotenv.config();

// const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');

  console.log('authorization', authorization);

  if (!token) {
    console.log('No token!');
    throw new AuthError('Authorization Required');
  }

  let payload;

  try {
    // payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret');
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthError('Authorization Required');
  }

  req.user = payload;

  // req.user = {bla: '123', ...payload};
  next();
};
