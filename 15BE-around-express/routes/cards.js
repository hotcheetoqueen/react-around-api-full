const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cards = require('../controllers/cards');

router.get('/', (req, res) => {
  cards.getCards(req, res);
});

router.post('/', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required(),
  }).options({ allowUnknown: true }),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri({ scheme: ['http', 'https'] }),
    // link: Joi.string().required().custom((value, helpers) =>
    //   validator.isURL(value) ? value : helpers.message('Url should be valid.')
    // ).messages({ 'any.required' : 'You must include a valid image address.' }),
    likes: Joi.array().items(Joi.string()),
  }),
}), (req, res) => {
  cards.postCard(req, res);
});

router.delete('/:cardId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required(),
  }).options({ allowUnknown: true }),
  params: Joi.object().keys({
    cardId: Joi.string().required().hex(),
  }),
}), (req, res) => {
  cards.deleteCard(req, res);
});

router.put('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required(),
  }).options({ allowUnknown: true }),
  params: Joi.object().keys({
    cardId: Joi.string().required().hex(),
  }),
}), (req, res) => {
  cards.likeCard(req, res);
});

router.delete('/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().regex(/^(Bearer )[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/).required(),
  }).options({ allowUnknown: true }),
  params: Joi.object().keys({
    cardId: Joi.string().required().hex(),
  }),
}), (req, res) => {
  cards.unlikeCard(req, res);
});

module.exports = router;
