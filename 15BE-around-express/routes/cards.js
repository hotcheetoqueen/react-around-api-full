const router = require('express').Router();
const cards = require('../controllers/cards');

router.get('/', (req, res) => {
  cards.getCards(req, res);
});

router.post('/', (req, res) => {
  cards.postCard(req, res);
});

router.delete('/:id', (req, res) => {
  cards.deleteCard(req, res);
});

router.put('/:cardId/likes', (req, res) => {
  cards.likeCard(req, res);
});

router.delete('/:cardId/likes', (req, res) => {
  cards.unlikeCard(req, res);
});

module.exports = router;
