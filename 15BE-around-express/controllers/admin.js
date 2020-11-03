const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const SALT_ROUND = 10;

const registerAdmin= (req, res) => {
  // req.body
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send({ message: 'Uh oh, something is wrong with those credentials!'});

  return bcrypt.hash(password, SALT_ROUND, (err, hash) => {
    return Admin.findOne({ email })
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


// const authorizeAdmin = (req, res)

module.exports = {registerAdmin};