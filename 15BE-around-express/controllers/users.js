const User = require('../models/user');
const { isAuthorized } = require('../utils/jwt');


module.exports.getAllUsers = (req, res) => {
  if (isAuthorized(req.headers.authorization)) return res.status(401);

  User.find({ })
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Sorry, our server is sad' }));
};

module.exports.getProfile = (req, res) => {
  if (isAuthorized(req.headers.authorization)) return res.status(401);


  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'User not found' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(500).send({ message: 'Sorry, our server is sad' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  User.create({ name, about, avatar, email, password })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Not valid user data' });
      } else {
        res.status(500).send({ message: 'Sorry, our server is sad' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Not valid user data' });
      } else {
        res.status(500).send({ message: 'Sorry, our server is sad' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Not valid user data' });
      } else {
        res.status(500).send({ message: 'Sorry, our server is sad' });
      }
    });
};
