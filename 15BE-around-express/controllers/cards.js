const Card = require('../models/card');

const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');
const ServerError = require('../errors/ServerError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .populate('likes')
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      throw new ServerError('Unable to find cards')
    })
    .catch(next);
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Unable to create card');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else if (!card) {
        throw new NotFoundError('Unable to find card');
      } else {
        throw new AuthError('Seems you are not the owner of this card');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('Unable to find card');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else if (!card) {
        throw new NotFoundError('Welp, that did not work as expected');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.statusCode === 404) {
        throw new NotFoundError('Welp, that did not work as expected');
      }
    })
    .catch(next);
};

module.exports.unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate('likes')
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else if (!card) {
        throw new NotFoundError('Welp, that did not work as expected');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.statusCode === 404) {
        throw new NotFoundError('Welp, that did not work as expected');
      }
    })
    .catch(next);
};
