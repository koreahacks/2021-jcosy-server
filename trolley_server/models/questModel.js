const mongoose = require('mongoose');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
var date = moment().format('YYYY-MM-DD HH:mm:ss');

const questSchema = new mongoose.Schema({
    title: {type: String, required: true},
    image: {type: String, required: true},
    level: {type: Number, required: true},
    category: {type: Number, required: true},//0: 타임어택, 1: 메인, 2: 서브
    ad: {type: Number, default:0},//0: 광고 아님, 1: 광고
    how_to: {type: String, required: true},
    sub_title: {type: String, required: true},
    description: {type: String, required: true},
    participant: {type: Number, default: 0},
    completed: {type: Number, default:0},
    
    participant_list: [{
        userIdx: {type: mongoose.Schema.Types.ObjectId, ref: "user", required: true},
        img_url: {type: String, required: true},
        completed_at: {type: String, default: date}
    }],
    
    //타임어택만
    period: {type: String, required: false},//string 시작 - 끝 시간
    running_time: {type: Number, required: false},//분
});


questSchema.statics.register = function(payload) {
    const quest = new this(payload);
    return quest.save();
}

// userIdx가 participant_list 안에 있으면 completed: 1 append 해서 json 반환
questSchema.statics.showTimeQuest = function() {
    return this.find({"category": 0}, {"title": true, "period": true, "participant": true, "image": true});
}

questSchema.statics.showMainQuest = function(userIdx) {
    // const party_list = this.find({"category": 1}, {"participant_list": true});
    // console.log('party: ', party_list);
    // return this.find({"participant_list.userIdx" : mongoose.Types.ObjectId(userIdx)});
    return this.find({"category": 1}, {"title": true, "level": true, "participant_list": true, "participant": true, "completed": true});
}


questSchema.statics.selectMainCompleted = function(userIdx, userLevel) {
    return this.find({"category": 1, "participant_list.userIdx" : userIdx}, {"title": true, "level": true, "participant": true, "completed": true, "image": true})
                .where('level').equals(userLevel);
}

questSchema.statics.selectMainNotCompleted = function(userIdx, userLevel) {
    return this.find({"category": 1, "participant_list.userIdx":{$ne: userIdx}}, {"title": true, "level": true, "participant": true, "completed": true, "image": true})
                .where('level').equals(userLevel);
    // M.findOne({list: {$ne: 'A'}}
}

questSchema.statics.selectSubCompleted = function(userIdx, userLevel) {
    return this.find({"category": 2, "participant_list.userIdx" : userIdx}, {"title": true, "level": true, "participant": true, "completed": true, "image": true})
                .where('level').gt(0).lt(userLevel+1);
}

questSchema.statics.selectSubNotCompleted = function(userIdx, userLevel) {
    return this.find({"category": 2, "participant_list.userIdx":{$ne: userIdx}}, {"title": true, "level": true, "participant": true, "completed": true, "image": true})
                .where('level').gt(0).lt(userLevel+1)
                .sort('-level')
                .limit(2);
    // M.findOne({list: {$ne: 'A'}}
}

questSchema.statics.showAdQuestCom = function (userIdx, userLevel) {
    return this.find({"ad": 1, "participant_list.userIdx" : userIdx}, {"title": true, "level": true, "participant": true, "image": true})
                .where('level').equals(userLevel);

}

questSchema.statics.showAdQuestNotCom = function (userIdx, userLevel) {
    return this.find({"ad": 1, "participant_list.userIdx":{$ne: userIdx}}, {"title": true, "level": true, "participant": true, "image": true})
                .where('level').equals(userLevel);
}

questSchema.statics.showRemainSubQuest = function () {
    return this.find({"completed": 0},{"title": true, "level": true, "participant": true, "image": true});
}

questSchema.statics.updateParticipantList = function(payload, questIdx) {
    return this.findOneAndUpdate({"_id": questIdx}, {$push: {
                                                        participant_list: {
                                                            userIdx: payload.userIdx,
                                                            img_url: payload.img_url
                                                        }}}, {new: true});
}

questSchema.statics.participantIncrement = function(questIdx){
    return this.findOneAndUpdate({'_id':mongoose.Types.ObjectId(questIdx)}, {$inc: {'participant':1}}, {new: true})
}

questSchema.statics.showHistory = function(userIdx){
    return this.find({"participant_list.userIdx" : mongoose.Types.ObjectId(userIdx)})
                .sort({"participant_list.completed_at": -1})
                .select('title level image')
                .select({ participant_list: {$elemMatch: {userIdx: mongoose.Types.ObjectId(userIdx)}}})
                .select('participant_list.completed_at');
}

questSchema.statics.showSubQuestList = function(userLevel){
    return this.find()
                .where('category').equals(2)//서브 퀘스트
                .where('ad').equals(0)//광고 아님
                .where('level').gt(0).lt(userLevel+1)
                .select('title level image participant');
}


module.exports = mongoose.model('quest', questSchema);
