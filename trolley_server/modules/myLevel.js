const UserModel = require('../models/userModel');

module.exports = {
    myLevel: async(userIdx)=>{
        const result = await UserModel.getMypage(userIdx).exec();
        const allUser = await UserModel.getAllUser().exec();
        let myRank = 1
        let my_user = result[0]

        for(var i = 0; i<allUser.length; i++){
            if (allUser[i]._id!=userIdx){
                i_user = allUser[i]
                if (i_user.level>my_user.level){
                    myRank+=1;
                    continue
                }
                else if(i_user.level==my_user.level){
                    if (i_user.main_stamp>my_user.main_stamp){
                        myRank+=1
                        continue
                    }
                    else if(i_user.main_stamp==my_user.main_stamp){
                        if (i_user.sub_stamp>my_user.sub_stamp){
                            myRank+=1
                            continue
                        }
                    }
                }
            }
        }

        return myRank;
    }
}