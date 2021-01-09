var express = require('express');
var router = express.Router();

const UserController = require('../controllers/userController');
const AuthMiddleware = require('../middlewares/auth');

// router.post('/signin', UserController.signin);
router.post('/verify', UserController.verify);


module.exports = router;
