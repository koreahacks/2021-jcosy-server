var express = require('express');
var router = express.Router();
const upload = require('../modules/multer');

const QuestController = require('../controllers/questController');

router.post('/quest/register', upload.single('image'), QuestController.register);

router.get('/time/:userIdx', QuestController.showTimeQuest);
module.exports = router;

