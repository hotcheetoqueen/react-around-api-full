const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    unique: true,
    //Getting 400 post error when validating this way here
    // validate: {
    //   validator: (email) => validator.isEmail(email),
    //   message: 'That is not a valid email address',
    // },
  },
  password: {
    required: true,
    type: String,
  },
   name: {
    type: String,
    default: 'Jacques Cousteau',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Explorer',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    // validate: {
      // validator(v) {
      //   return /^(https?):\/\/(www\.)?[\w-@:%+~#=]+[.][.\w/\-?#=&~@:()!$+%]*$/gm.test(v);
      // },
    // },
  },
});

module.exports = mongoose.model('admin', adminSchema);