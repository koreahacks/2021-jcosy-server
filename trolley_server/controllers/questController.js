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
            const userLevelResult = await UserModel.getUserLevel(userIdx);
            const userLevel = userLevelResult[0].level
            const cc = await QuestModel.selectMainCompleted(userIdx, userLevel);
            const nc = await QuestModel.selectMainNotCompleted(userIdx, userLevel);

            cc.forEach(e => {
                e.completed = 1;
            });

            nc.forEach(e => {
                e.completed = 0;
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
            const userLevelResult = await UserModel.getUserLevel(userIdx);
            const userLevel = userLevelResult[0].level;
            const cc = await QuestModel.selectSubCompleted(userIdx, userLevel);
            const nc = await QuestModel.selectSubNotCompleted(userIdx, userLevel);

            cc.forEach(e => {
                e.completed = 1;
            });

            nc.forEach(e => {
                e.completed = 0;
            });

            // const result = cc.concat(nc);

            if (!nc) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.READ_SUB_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_SUB_SUCCESS, nc));
        } catch (err) {
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showAdQuest: async (req, res) => {
        const userIdx = req.decoded._id;

        try {
            const userLevelResult = await UserModel.getUserLevel(userIdx);
            const userLevel = userLevelResult[0].level;
            const cc = await QuestModel.showAdQuestCom(userIdx, userLevel);
            const nc = await QuestModel.showAdQuestNotCom(userIdx, userLevel);

            cc.forEach(e => {
                e.completed = 1;
            });

            nc.forEach(e => {
                e.completed = 0;
            });

            // const result = cc.concat(nc);

            if (!nc) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.READ_AD_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_AD_SUCCESS, nc));
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
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.UPDATE_LIST_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_LIST_SUCCESS, result));
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
                category: partInc.category, 
                user_level: updatedLevelResult.level,
                main_stamp: updatedLevelResult.main_stamp,
                sub_stamp: updatedLevelResult.sub_stamp
            }));

        }catch(err){
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showDetail: async(req, res) => {
        const userIdx = req.decoded._id;
        const questIdx = req.params.questIdx;

        try {
            const result = await QuestModel.showDetail(userIdx, questIdx);
            const cc = await QuestModel.showDetailCom(userIdx, questIdx);
            if (cc) {
                result.completed = 1;
            } else {
                result.completed = 0;
            }

            console.log('result: ', result);

            if (!result) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.READ_DETAIL_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_DETAIL_SUCCESS, result));
        } catch (err) {
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showImagesByQuest: async(req, res) => {
        const questIdx = req.params.questIdx;

        try {
            const result = await QuestModel.showImagesByQuest(questIdx);
            console.log(result);

            if (!result) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.SHOW_IMAGES_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_IMAGES_SUCCESS, result[0].participant_list));
        } catch (err) {
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showRealTimeImages: async(req, res) => {
        const questIdx = req.params.questIdx;

        try {
            const result = await QuestModel.showRealTimeImages(questIdx);
            console.log(result);
            
            var arr = [];
            for (var i in result[0].participant_list){
                console.log('i:', i);
                var userIdx = result[0].participant_list[i].userIdx;
                var profile = await UserModel.showProfile(userIdx);
                // console.log('profile: ',profile);
                // console.log(profile.name);
                arr.push({
                    _id: userIdx,
                    name: profile.name,
                    profileImg: profile.profileImg,
                    img_url: result[0].participant_list[i].img_url,
                    completed_at: result[0].participant_list[i].completed_at
                });
            }
            console.log(arr);
            
            // const profile = await UserModel.showProfile(result[i].userIdx);

            if (!arr) {
                return res.status(statusCode.OK).send(util.fail(statusCode.OK, resMessage.SHOW_IMAGES_FAIL));
            }
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_IMAGES_SUCCESS, arr));
        } catch (err) {
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    }
}

module.exports = quest;