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
        const userIdx = req.decoded._id;
        // console.log('userIdx:', userIdx);
        try {
            const result = await QuestModel.showTimeQuest();
            console.log(result);
            if (!result) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.READ_TIME_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_TIME_SUCCESS, result));
        } catch (err) {
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showMainQuest: async (req, res) => {
        const userIdx = req.decoded._id;
        
        try {
            const cc = await QuestModel.selectCompleted(userIdx);
            const nc = await QuestModel.selectNotCompleted(userIdx);

            cc.forEach(e => {
                e.completed = 1;
                e.participant = e.participant_list.length;
            });

            nc.forEach(e => {
                e.completed = 0;
                e.participant = e.participant_list.length;
            });

            const result = cc.concat(nc);

            if (!result) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.READ_MAIN_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_MAIN_SUCCESS, result));
        } catch (err) {
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showSubQuest: async (req, res) => {
        const userIdx = req.decoded._id;
        
        try {
            const cc = await QuestModel.selectCompleted(userIdx);
            const nc = await QuestModel.selectNotCompleted(userIdx);

            cc.forEach(e => {
                e.completed = 1;
                e.participant = e.participant_list.length;
            });

            nc.forEach(e => {
                e.completed = 0;
                e.participant = e.participant_list.length;
            });

            // const result = cc.concat(nc);

            if (!nc) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.READ_MAIN_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_MAIN_SUCCESS, nc));
        } catch (err) {
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    updateParticipantList: async (req, res) => {
        const userIdx = req.decoded._id;
        const data = req.body;
        // console.log(data.userIdx);
        const questIdx = req.params.questIdx;
        // const {data} = req.body;

        // participant_list에 userIdx, img_url 집어넣는것
        const payload = {
            "userIdx": userIdx,
            "img_url": data.img_url
        }
        console.log(payload);
        
        try {
            const result = await QuestModel.updateParticipantList(payload, questIdx);
            if (!result) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.READ_SUB_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_SUB_SUCCESS, result));
        } catch (err) {
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
}

module.exports = quest;