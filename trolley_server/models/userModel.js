const mongoose = require('mongoose');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
var date = moment().format('YYYY-MM-DD HH:mm:ss');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    profileImg: {type: String, required: true},
    email: {type: String, required: true},
    level: {type: Number, default: 1},
    main_stamp: {type: Number, default: 0},
    sub_stamp: {type:Number, default: 0}
});

module.exports = mongoose.model('user', userSchema);
