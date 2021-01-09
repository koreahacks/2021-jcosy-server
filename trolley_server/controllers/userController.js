const UserModel = require('../models/userModel');
const statusCode = require('../modules/statusCode');
const util = require('../modules/util');
const resMessage = require('../modules/resMessage');
const levelFunction = require('../modules/myLevel');
const jwt = require('../modules/jwt');

const user = {
    register: async (req, res)=>{
        const image = req.file.location;
        const user = req.body;
        try{
            user.profileImg = image;
            const userResult = await UserModel.register(user);
            const {token, _} = await jwt.sign(userResult);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.USER_REGISTER_SUCCESS, {token: token}));
        }catch(err){
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    getMyPage: async(req, res)=>{
        const userIdx = req.decoded._id;
        try{
            const myRank = await levelFunction.myLevel(userIdx);
            const result = await UserModel.getMypage(userIdx).exec();
            let toSend = {};
            toSend.profileImg = result[0].profileImg;
            toSend.name = result[0].name;
            toSend.email = result[0].email;
            toSend.level = result[0].level;
            toSend.ranking = myRank;
            //console.log(result[0]);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_MY_INFO_SUCCESS, toSend));
        }catch(err){
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showRank: async(req, res)=>{
        const userIdx = req.decoded._id;
        try{
            const result = await UserModel.getMypage(userIdx).exec();
            const myRank = await levelFunction.myLevel(userIdx);
            var toSend = {};
            toSend.myName = result[0].name;
            toSend.myImage = result[0].profileImg;
            toSend.myRank = myRank;
            let top10 = await UserModel.getTop10Rank().exec();
            toSend.top10 = top10;
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.GET_RANKING_SUCCESS, toSend));
        }catch(err){
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
    showHistory: async(req, res)=>{

    },
    showStamp: async(req, res)=>{
        const userIdx = req.decoded._id;
        try{
            const result = await UserModel.getMypage(userIdx).exec();
            let toSend = {};
                toSend.name = result[0].name;
                toSend.level = result[0].level;
                toSend.main_stamp = result[0].main_stamp;
                toSend.sub_stamp = result[0].sub_stamp;
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.STAMP_POP_UP_SUCCESS, toSend));
        }catch(err){
            console.log(err);
            return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DB_ERROR));
        }
    },
}

module.exports = user;
