const User = require('../models/user');
const bcrypt = require('bcrypt');
const SALT_ROUND = 10;
const jwt = require('jsonwebtoken');
const { generateJWT } = require('../utils/jwt');

const { isAuthorized } = require('../utils/jwt');

const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');
const ServerError = require('../errors/ServerError');


module.exports.getAllUsers = (req, res, next) => {
  if (isAuthorized(req.headers.authorization)) return res.status(401);

  User.find({ }).select('+password')
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getProfile = (req, res, next) => {
  if (isAuthorized(req.headers.authorization)) return res.status(401);


  User.findById(req.params.id).select('+password')
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Cannot find user');
      }
      next(err);
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      if (!user) {
        throw new NotFoundError('User not found')
      }
      res.send(user)
    })
    .catch(next)
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt.hash(password, 10, (error, hash) => {
    return User.findOne({ email })
    .then((user) => {
      if (user) return res.status(403).send({ message: 'This user already exists'});

      return User.create({ name, about, avatar, email, password: hash })
        .then((user) => {
          return res.status(200).send({
            message: `User ${email} successfully created!`,
            data: {
              _id: user._id
            }
          });
        })
        .catch((err) => res.status(400).send(err));
    })
    .catch(() => res.status(400).send({ message: 'Error occurred' }));
  });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }).select('+password')
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Cannot update user');
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }).select('+password')
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Cannot update user');
      }
      next(err);
    })
    .catch(next);
};

const getJwtToken = (id) => {
  return jwt.sign({ id }, 'secret');
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).send({ message: 'Uh oh, email and password is missing!'});

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) return res.status(403).send({ message: 'Uh oh, something is wrong with those credentials!'})

      return bcrypt.compare(password, user.password, (error, isPasswordValid) => {

        if (!isPasswordValid) return res.status(401).send({ message: 'Uh oh, something is wrong with those credentials!'});

        const token = getJwtToken(user._id);

        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true
        })

        return res.status(200).send({ token });
      });
    })
  .catch((err) => {
    res.status(400).send({ message: 'Error occured' })
  });
}