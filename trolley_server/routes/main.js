var express = require('express');
var router = express.Router();
const upload = require('../modules/multer');

const QuestController = require('../controllers/questController');
const AuthMiddleware = require('../middlewares/auth');

router.post('/quest/register', upload.single('image'), QuestController.register);

router.get('/time', AuthMiddleware.checkToken, QuestController.showTimeQuest);
router.get('/quest', AuthMiddleware.checkToken, QuestController.showMainQuest);
router.get('/sub', AuthMiddleware.checkToken, QuestController.showSubQuest);

router.put('/list/:questIdx', QuestController.updateParticipantList);

module.exports = router;

