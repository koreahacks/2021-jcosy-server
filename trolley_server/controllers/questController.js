const QuestModel = require('../models/questModel');
const UserModel = require('../models/userModel');
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
        const userIdx = req.decoded.userIdx;
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
        const userIdx = req.decoded.userIdx;
        
        try {
            const result = await QuestModel.showMainQuest(userIdx);
            console.log(result);
            
            // participant_list에 userIdx 값 있으면 completed: 1 추가
            result.forEach(e => {
                console.log(e.participant_list);
                if (e.participant_list.forEach(id => {
                    id === userIdx
                })) {
                    e.completed = 1;
                }
            });

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
        const userIdx = req.decoded.idx;
        try {
            const result = await QuestModel.showSubQuest(userIdx);
            if (!result) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.READ_SUB_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_SUB_SUCCESS, result));
        } catch (err) {
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showSubQuestList : async(req, res)=>{
        const userIdx = req.decoded._id;
        try{
            const userLevelResult = await UserModel.getUserLevel(userIdx);
            const userLevel = userLevelResult[0].level;
            //console.log('userLevel : ', userLevel);
            const subQuestListResult = await QuestModel.showSubQuestList(userLevel);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_SUB_ALL, subQuestListResult));
        }catch(err){
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    updateParticipantList: async (req, res) => {

        // const userIdx = req.decoded.userIdx;
        const data = req.body;
        // console.log(data.userIdx);
        const questIdx = req.params.questIdx;
        // const {data} = req.body;

        // participant_list에 userIdx, img_url 집어넣는것
        const payload = {
            "userIdx": data.userIdx,
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
    uploadReviewImages: async(req, res)=>{
        const userIdx = req.decoded._id;
        const imgUrl = req.file.location;
        const questIdx = req.params.questIdx;
        try{
            const payload = {
                "userIdx": userIdx,
                "img_url": imgUrl
            }
            console.log('payload : ', payload)
            console.log('questIdx : ', questIdx);
            const appendedPartList = await QuestModel.updateParticipantList(payload,questIdx);
            const partInc = await QuestModel.participantIncrement(questIdx);
            const userParticipated = await UserModel.participated(userIdx);
            console.log('appendedPartList : ', appendedPartList);
            console.log('partInc : ', partInc);
            console.log('userParticipated : ', userParticipated);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_SUB_SUCCESS, userParticipated));
            //사진 올리면 participant list에 추가되고
            // participant +1되고
            // userSchema에 level, main, sub 카운트 +1 해주기

        }catch(err){
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    }
}

module.exports = quest;