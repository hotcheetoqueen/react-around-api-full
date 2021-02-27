const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const users = require('../controllers/users');

router.get('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required(),
  }).options({ allowUnknown: true }),
}), (req, res) => {
  users.getAllUsers(req, res);
});

router.get('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required(),
  }).options({ allowUnknown: true }),
}), (req, res) => {
  users.getCurrentUser(req, res);
});

router.patch('/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required(),
  }).options({ allowUnknown: true }),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), (req, res) => {
  users.updateUser(req, res);
});

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((value, helpers) => (validator.isURL(value) ? value : helpers.message('Url should be valid.')))
      .messages({
        'any.required': 'You must include a valid image address.',
      }),
  }),
}), users.updateAvatar);

router.get('/:id', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required(),
  }).options({ allowUnknown: true }),
  params: Joi.object().keys({
    id: Joi.string().required().alphanum(),
  }),
}), (req, res) => {
  users.getProfile(req, res);
});

module.exports = router;
