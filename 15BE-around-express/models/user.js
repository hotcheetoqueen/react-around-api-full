const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    validate: {
      validator(v) {
        return /^(https?):\/\/(www\.)?[\w-@:%+~#=]+[.][.\w/\-?#=&~@:()!$+%]*$/gm.test(v);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'That is not a valid email address',
    },
  },
  password: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('user', userSchema);
