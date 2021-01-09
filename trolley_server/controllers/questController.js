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
            const cc = await QuestModel.showSubQuestCom(userIdx);
            const nc = await QuestModel.showSubQuestNotCom(userIdx);

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
    showAdQuest: async (req, res) => {
        const userIdx = req.decoded._id;

        try {
            const cc = await QuestModel.showAdQuestCom(userIdx);
            const nc = await QuestModel.showAdQuestNotCom(userIdx);

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
    uploadReviewImages: async(req, res)=>{
        const userIdx = req.decoded._id;
        const imgUrl = req.file.location;
        const questIdx = req.params.questIdx;
        try{
            const payload = {
                "userIdx": userIdx,
                "img_url": imgUrl
            };
            const appendedPartList = await QuestModel.updateParticipantList(payload,questIdx);
            const partInc = await QuestModel.participantIncrement(questIdx);
            //console.log('partInc : ', partInc.category);// 0: 타임어택, 1: 메인, 2: 서브
            if(partInc.category==0){// 타임어택
                const taPart = await UserModel.subParticipated(userIdx);
            }else if(partInc.category==1){//메인
                const mainPart = await UserModel.mainParticipated(userIdx);
            }else if(partInc.category==2){//서브
                const subPart = await UserModel.subParticipated(userIdx);
            }
            const userParticipated = await UserModel.getMypage(userIdx);
            //console.log('userParticipated : ', userParticipated);

            const user_main_stamp = userParticipated[0].main_stamp;
            const user_sub_stamp = userParticipated[0].sub_stamp;
            const user_level = userParticipated[0].level;

            let updated_main_stamp = user_main_stamp;
            let updated_sub_stamp = user_sub_stamp;
            let updated_level = user_level;

            if(user_level==1){
                if (user_main_stamp==2 && user_sub_stamp>=1){
                    updated_main_stamp = 0;
                    updated_level += 1;
                    updated_sub_stamp = user_sub_stamp - 1;
                }
            }else if(user_level==2){
                if(user_main_stamp==2 && user_sub_stamp>=3){
                    updated_main_stamp = 0;
                    updated_level += 1;
                    updated_sub_stamp = user_sub_stamp - 3;
                }
            }

            const levPayload = {
                level: updated_level,
                main_stamp: updated_main_stamp,
                sub_stamp: updated_sub_stamp
            };
            const updatedLevelResult = await UserModel.updateLevel(userIdx, levPayload);
            //console.log('updatedLevelResult : ', updatedLevelResult);
            
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.PARTICIPATED_SUCCESS, {
                user_level: updatedLevelResult.level,
                main_stamp: updatedLevelResult.main_stamp
            }));

        }catch(err){
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    }
}

module.exports = quest;