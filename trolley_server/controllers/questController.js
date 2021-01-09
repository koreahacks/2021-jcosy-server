const QuestModel = require('../models/questModel');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');
const resMessage = require('../modules/resMessage');

const quest = {
    register: async (req, res) => {
        const imgUrl = req.file.location;
        const data = req.body;
        console.log('imgUrl : ', imgUrl);
        console.log('data : ', data);
        data.image = imgUrl;
        try {
            const result = await QuestModel.register(data);
            if (!result) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.QUEST_REGISTER_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.QUEST_REGISTER_SUCCESS, result));
        } catch (err) {
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showTimeQuest: async (req, res) => {
        const userIdx = req.params.userIdx;
        try {
            const result = await QuestModel.showTimeQuest(userIdx);
            if (!result) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.READ_TIME_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_TIME_SUCCESS, result));
        } catch (err) {
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    }
}

module.exports = quest;