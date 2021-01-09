const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    profileImg: {type: String, required: false},
    email: {type: String, required: true},
    level: {type: Number, default: 1},
    //ranking: {type: Number, required: true},
    main_stamp: {type: Number, default: 0},
    sub_stamp: {type:Number, default: 0}
});

userSchema.statics.register = function(payload){
    const user = new this(payload);
    return user.save();
};

userSchema.statics.getAllUser = function(){
    return this.find();
}

userSchema.statics.getMypage = function(userIdx){
    return this.find()
            .where('_id').equals(mongoose.Types.ObjectId(userIdx));
}

userSchema.statics.getTop10Rank = function(){
    return this.find()
            .sort('-level')
            .sort('-main_stamp')
            .sort('-sub_stamp')
            .limit(10)
            .select('profileImg name');
}

/**
 * User.find()
    .where('name').equals('zerocho')
    .where('birth').gt(20)
    .where('role').in(['owner', 'admin'])
    .sort('-medals')
    .limit(5)
    .select('name birth medals')
 */

module.exports = mongoose.model('user', userSchema);
