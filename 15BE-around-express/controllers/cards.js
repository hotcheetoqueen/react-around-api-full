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
  console.log(req.user)
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log('Error ', err)
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
  let user = req.user.id;

  Card.findById(req.params.cardId)
  .then((card) => {
    if (card.likes.includes(user)) {
      return res.status(200).send({data: card})
    }
    Card.findByIdAndUpdate(card._id,
      { $addToSet: { 'likes': user } }, { new: true, runValidators: true })
      .then(card => {
        res.send({data: card})
      })
  })
    .catch(next);
};

module.exports.unlikeCard = (req, res, next) => {
  let user = req.user.id;

  Card.findById(req.params.cardId)
  .then((card) => {
    if (card.likes.includes(user)) {
      return res.status(200).send({data: card})
    }
  Card.findByIdAndUpdate(card._id,
    { $pull: { 'likes': user }  }, { new: true, runValidators: true })
    .then(card => {
      res.send({data: card})
    })
  })
    .catch(next);
};
