const User = require('../models/user');
// const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const SALT_ROUND = 10;
const jwt = require('jsonwebtoken');
const { generateJWT } = require('../utils/jwt');
// const RequestError = require('../errors/RequestError');

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

  bcrypt.hash(password, 10)
    .then((hash) =>
    User.create({ name, about, avatar, email, password })
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new RequestError('Cannot create user');
        }
        next(err);
      })
    )
      // console.log('user');

      // .catch(next);
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

// module.exports.registerAdmin = (req, res) => {
//   // req.body
//   const { email, password, name, about, avatar } = req.body;

//   if (!email || !password) return res.status(400).send({ message: 'Uh oh, something is wrong with those credentials!'});

//   return bcrypt.hash(password, SALT_ROUND, (err, hash) => {
//     return Admin.findOne({ email }).select('+password')
//       .then(admin => {
//         if (admin) return res.status(403).send({message: 'This email already exists'});

//         return Admin.create({ email, password: hash })
//           .then(user => {
//             res.status(200).send(user)
//           })
//           .catch(err => res.status(400).send(err))
//       })
//   });
// }


module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send({ message: 'Uh oh, something is wrong with those credentials!'});

  // TODO check id & move isPasswordValid to .then(), don't need error; req._id = user._id;

  User.findOne({ email }).select('+password')
    .then(user => {
      if (!user) {
        throw new RequestError('Something is wrong with those credentials');
    } else {
      req._id = user._id;
      return bcrypt.compare(password, user.password);
    }
  })

  return bcrypt.compare(password, user.password)
      .then((isPasswordValid) => {
        if(!isPasswordValid) {
          throw new RequestError('Something is wrong with those credentials');
        }

        const token = generateJWT(user.id);
        // const token = jwt.sign({ _id: req._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
        // res.header('authorization', `Bearer ${token}`);
        // res.cookie('token', token, { httpOnly: true });
        // res.status(200).send({ token });

        //Do I still need this?
        return res.status(200).send({ email });
      })
  .catch(next);
}