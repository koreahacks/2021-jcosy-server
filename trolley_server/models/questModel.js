const mongoose = require('mongoose');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');
var date = moment().format('YYYY-MM-DD HH:mm:ss');

const questSchema = new mongoose.Schema({
    title: {type: String, required: true},
    image: {type: String, required: true},
    level: {type: Number, required: true, default: 0}, // 타임어택: 0 (레벨 없음) 
    category: {type: Number, required: true},//0: 타임어택, 1: 메인, 2: 서브
    ad: {type: Number, default:0},//0: 광고 아님, 1: 광고
    how_to: {type: String, required: true},
    sub_title: {type: String, required: true},
    description: {type: String, required: true},
    participant: {type: Number, default: 0},
    
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

/**

productSchema.statics.register = function(payload){
    const product = new this(payload);
    return product.save();
};

productSchema.statics.showAllById = function(_id){
    return this.find().sort({date: -1})
                .where('userIdx').equals(_id)
                .populate("userIdx");//join과 같은 기능
};

productSchema.statics.showProductsBySubCategory = function(_id, subCategoryIdx){
    return this.find().sort({date: -1})
                .where('subCategory').equals(subCategoryIdx)
                .where('like').equals(false)
                .where('userIdx').equals(_id)
                .populate('userIdx');
};

productSchema.statics.showByMainCategory = function(_id, mainCategoryIdx){
    return this.find().sort({date: -1})
                .where('mainCategory').equals(mainCategoryIdx)
                .where('like').equals(false)
                .where('userIdx').equals(_id)
                .populate('userIdx');
};

productSchema.statics.showOneProductDetail = function(_id, productIdx){
    return this.find()
                .where('_id').equals(mongoose.Types.ObjectId(productIdx))
                .where('userIdx').equals(_id)
                .populate('userIdx');
};

// _id에 해당하는 document에서 payload(바꿔야하는 key-value 쌍 그 자체)로 바꿔라
// {new: true}이면 update한 값 리턴해줌
productSchema.statics.deleteOneProduct = function(_id, payload){
    return this.findOneAndUpdate({_id}, payload, {new: true});
};

productSchema.statics.heartClicked = function(_id, payload){
    return this.findOneAndUpdate({_id}, payload, {new: true});
}
 */

module.exports = mongoose.model('quest', questSchema);
