const router = require('express').Router();
const { registerAdmin, authorizeAdmin } = require('../controllers/admins');

router.post('/register', registerAdmin);
router.post('/auth', authorizeAdmin);

module.exports = router;