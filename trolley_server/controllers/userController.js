const UserModel = require('../models/userModel');
const CODE = require('../modules/statusCode');
const MSG = require('../modules/resMessage'); 
const util = require('../modules/util');
const jwt = require('../modules/jwt');

const user = {
    verify: async (req, res) => {
        const {
            userIdx
        } = req.body;

        const {
            token,
            _
        } = await jwt.sign(userIdx);

        // 로그인이 성공적으로 마쳤다면 - LOGIN_SUCCESS 전달
        res.status(CODE.OK)
            .send(util.success(CODE.OK, MSG.LOGIN_SUCCESS, {
                accessToken: token
                //, refreshToken: refreshToken
            }));
    },
}

module.exports = user;
