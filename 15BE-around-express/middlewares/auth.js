const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret';
// const AuthError = require('../middleware/errors/AuthError')

module.exports = (req, res, next) => {

  const { authorization } = req.headers;
  const token = authorization.replace('Bearer ', '');

  console.log('authorization', authorization)

  if (!token) {
    console.log('No token!')
    return res
      .status(401)
      .send({ message: 'Authorization Required' });
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Authorization Required' });
  }

  req.user = payload;

  // req.user = {bla: '123', ...payload};
  next();
};
