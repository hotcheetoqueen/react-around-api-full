const User = require('../models/user');
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

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  User.create({ name, about, avatar, email, password }).select('+password')
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Cannot create user');
      }
      next(err);
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
