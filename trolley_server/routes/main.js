var express = require('express');
var router = express.Router();
const upload = require('../modules/multer');
const QuestController = require('../controllers/questController');
const authMiddleware = require('../middleware/auth');

router.post('/quest/register', upload.single('image'), QuestController.register);

module.exports = router;

