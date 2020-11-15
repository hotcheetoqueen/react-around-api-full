const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const SALT_ROUND = 10;
const { generateJWT } = require('../utils/jwt');
const RequestError = require('../errors/RequestError');

const registerAdmin= (req, res) => {
  // req.body
  const { email, password, name, about, avatar } = req.body;

  if (!email || !password) return res.status(400).send({ message: 'Uh oh, something is wrong with those credentials!'});

  return bcrypt.hash(password, SALT_ROUND, (err, hash) => {
    return Admin.findOne({ email }).select('+password')
      .then(admin => {
        if (admin) return res.status(403).send({message: 'This email already exists'});

        return Admin.create({ email, password: hash })
          .then(user => {
            res.status(200).send(user)
          })
          .catch(err => res.status(400).send(err))
      })
  });
}


const authorizeAdmin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send({ message: 'Uh oh, something is wrong with those credentials!'});

  // TODO check id & move isPasswordValid to .then(), don't need error; req._id = user._id;

  return Admin.findOne({ email }).select('+password')
    .then(admin => {
      if (!admin) {
        throw new RequestError('Something is wrong with those credentials');
    } else {
      return bcrypt.compare(password, admin.password, (err, isPasswordValid) => {
        if(!isPasswordValid) {
          throw new RequestError('Something is wrong with those credentials');
        }
        const token = generateJWT(admin.id);

        return res.status(200).send({ email });
      })
    }
  })
  .catch(next);
}

module.exports = { registerAdmin, authorizeAdmin };