var express = require('express');
var router = express.Router();
const upload = require('../modules/multer');
const QuestController = require('../controllers/questController');
const AuthMiddleware = require('../middlewares/auth');

router.post('/quest/register', upload.single('image'), QuestController.register);

router.get('/time', AuthMiddleware.checkToken, QuestController.showTimeQuest);
router.get('/quest', AuthMiddleware.checkToken, QuestController.showMainQuest);
router.get('/sub', AuthMiddleware.checkToken, QuestController.showSubQuest);

router.put('/list/:questIdx', AuthMiddleware.checkToken, QuestController.updateParticipantList);

// 인증 사진 올리기
router.post('/upload/:questIdx', AuthMiddleware.checkToken, upload.single('image'), QuestController.uploadReviewImages);
// 서브퀘스트 더보기
router.get('/quest/list', AuthMiddleware.checkToken, QuestController.showSubQuestList);

// 디테일 뷰 - 사진 모아보기
router.get('/detail/')

module.exports = router;

