const { Timestamp } = require('mongodb');
var mongoose  = require('mongoose');

userBookmarkSchema = mongoose.Schema({

    userIDFK:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'userMaster'
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
module.exports=mongoose.model("userBookmark",userBookmarkSchema);