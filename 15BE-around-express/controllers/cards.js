const Card = require('../models/card');

const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const RequestError = require('../errors/RequestError');
const ServerError = require('../errors/ServerError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    // .populate('likes')
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      throw new ServerError('Unable to find cards');
    })
    .catch(next);
};

module.exports.postCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user.id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new RequestError('Unable to create card');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ message: 'Card deleted' });
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
  const user = req.user.id;

  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.likes.includes(user)) {
        return res.status(200).send({ data: card });
      }
      return Card.findByIdAndUpdate(card._id,
        { $addToSet: { likes: user } }, { new: true, runValidators: true })
        .then((data) => {
          res.send({ data });
        });
    })
    .catch(next);
};

module.exports.unlikeCard = (req, res) => {
  const user = req.user.id;

  Card.findByIdAndUpdate(req.params.cardId,
    { $pull: { likes: user } }, { new: true, runValidators: true })
    .then((card) => {
      res.status(200).send({ data: card });
    });
};
