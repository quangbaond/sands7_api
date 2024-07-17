var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
const JwtMiddleware = require('../middleware/jwtMiddleware');

router.post('/login', JwtMiddleware.notLogin, authController.login);
router.post('/logout', JwtMiddleware.verifyToken, authController.logout);
router.post('/register', JwtMiddleware.notLogin, authController.register);

module.exports = router;

