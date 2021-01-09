var express = require('express');
var router = express.Router();

const QuestController = require('../controllers/questController');

router.post('/quest/register', QuestController.register);
module.exports = router;

