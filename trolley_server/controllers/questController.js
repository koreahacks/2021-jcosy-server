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
        console.log('userIdx:', userIdx);
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
            // const result = await QuestModel.showMainQuest(userIdx);
            // console.log(result);
            // const questIdx = result._id;
            const cc = await QuestModel.selectCompleted(userIdx);
            // console.log("cc: ", cc);

            const nc = await QuestModel.selectNotCompleted(userIdx);
            // console.log("nc: ",  nc);
            
            cc.forEach(e => {
                e.completed = 1;
            });

            nc.forEach(e => {
                e.completed = 0;
            });

            const result = cc.concat(nc);

            // const result = await QuestModel.showMainQuest(userIdx);

            // participant_list에 따라 참여자 수 세기
            // var count = 0;
            // for (var i in result) {
            //     // console.log('part: ',i);
            //     var list = result[i].participant_list;
            //     list.forEach(e => {
            //         count++;
            //         if (e.userIdx == userIdx) {
            //             console.log("true: ",e.userIdx);
            //             console.log(userIdx);
            //             result[i].completed = 1;
            //         } else {
            //             console.log("false: ", e.userIdx);
            //             console.log(userIdx);
            //             result[i].completed = 0;
            //         }
            //     })
            //     result[i].participant = count;
            //     count = 0;
            // }
            // console.log(count);

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
            const result = await QuestModel.showSubQuest();
            var count = 0;
            for (var i in result) {
                var list = result[i].participant_list;
                list.forEach(e => {
                    count++;
                    if (e.userIdx == userIdx) {
                        console.log("true: ",e.userIdx);
                        console.log(userIdx);
                        result[i].completed = 1;
                    } else {
                        console.log("false: ", e.userIdx);
                        console.log(userIdx);
                        result[i].completed = 0;
                    }
                })
                result[i].participant = count;
                count = 0;
            }

            const remainResult = await QuestModel.showRemainSubQuest();
            // console.log(count);
            if (!remainResult) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.READ_SUB_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_SUB_SUCCESS, remainResult));
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