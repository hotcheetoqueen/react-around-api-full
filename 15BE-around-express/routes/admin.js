const router = require('express').Router();
const {registerAdmin} = require('../controllers/admin');

router.get('/register', registerAdmin);

// router.get('/', (req, res) => {
//   cards.getCards(req, res);
// });

module.exports = router;