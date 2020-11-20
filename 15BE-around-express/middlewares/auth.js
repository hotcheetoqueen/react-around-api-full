const jwt = require('jsonwebtoken');
const JWT_SECRET = 'blabla';
// const AuthError = require('../middleware/errors/AuthError')

module.exports = (req, res, next) => {

  const { authorization } = req.headers;
  const token = authorization;

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

  req.user = {bla: '123', ...payload};
  next();
};
