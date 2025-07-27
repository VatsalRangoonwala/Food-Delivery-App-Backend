
var mongoose  = require('mongoose');

authSchema = mongoose.Schema({

    userIDFK:{
        type:String
    },

    email:{
        type:String
    },
    password:{
        type:String,
    },
    user_type:{
         type:String,
    },
    isActive:{
        type:Boolean,
        default:true
    },
    addedOn:{
        type:String,
    },
   

   
});
module.exports=mongoose.model("authMaster",authSchema);