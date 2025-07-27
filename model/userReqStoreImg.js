
var mongoose  = require('mongoose');

userReqStoreImgSchema = mongoose.Schema({

    userIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userMaster'
    },

    Image:{
        type:String,
    },
    
    foodstoreIdFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'foodStoreMaster'  
    },

    isActive:{
        type:Boolean,
        default:true
    },
    addedOn:{
        type:String,
    },


});
module.exports=mongoose.model("userReqStoreImg",userReqStoreImgSchema);