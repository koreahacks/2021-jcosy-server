var express = require('express');
var router = express.Router();
const upload = require('../modules/multer');
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/register', upload.single('image'), UserController.register);
router.get('/mypage', authMiddleware.checkToken, UserController.getMyPage);
router.get('/mypage/rank', authMiddleware.checkToken, UserController.showRank);
router.get('/mypage/history', authMiddleware.checkToken, UserController.showHistory);
router.get('/stamp', authMiddleware.checkToken, UserController.showStamp);

module.exports = router;
