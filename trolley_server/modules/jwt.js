const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey').secretKey;
const options = require('../config/secretKey').options;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
    sign: async (userIdx) => {
        // user 객체의 idx와 name 데이터를 주고받음.
        const payload = {
            userIdx: userIdx
        };
        const result = {
            token: jwt.sign(payload, secretKey, options),
            // 세 개의 받아온 인자를 sign 함수에 보내는 것!
            // 내가 가지고 있는 데이터(payload에 저장된 데이터)를 토큰으로 인코딩
            refreshToken: randToken.uid(256)
        };
        return result;
    },
    verify: async (token) => {
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
            console.log('decoded:', decoded);
            // 인코딩 되어 있는 토큰을 다시 내가 원하는 정보로 디코딩
        } catch (err) {
            if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            } else {
                console.log("invalid token");
                return TOKEN_INVALID;
            }
        }
        return decoded;
    }
}
